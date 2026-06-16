import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Seed mock orders for analytics when empty
export const seedInitialOrders = async () => {
  try {
    const count = await Order.countDocuments();
    if (count === 0) {
      const products = await Product.find({});
      if (products.length > 0) {
        const mockOrders = [];
        // Generate mock orders spread across the last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          // Generate 1 to 3 orders per day
          const ordersCount = Math.floor(Math.random() * 3) + 1;
          for (let j = 0; j < ordersCount; j++) {
            const prod1 = products[Math.floor(Math.random() * products.length)];
            const prod2 = products[Math.floor(Math.random() * products.length)];
            
            const quantity1 = Math.floor(Math.random() * 2) + 1;
            const quantity2 = Math.floor(Math.random() * 1) + 1;
            
            const total = (prod1.price * quantity1) + (prod2.price * quantity2);

            mockOrders.push({
              guestDetails: {
                name: `Client ${i}-${j}`,
                email: `client.${i}.${j}@test.com`,
                phone: '+91 9988776655',
                address: 'Bespoke Residence, Sector 15',
                city: 'New Delhi',
                state: 'Delhi',
                zip: '110001',
              },
              items: [
                {
                  product: prod1._id,
                  name: prod1.name,
                  price: prod1.price,
                  quantity: quantity1,
                  selectedSize: prod1.sizes[0] || 'M',
                },
                {
                  product: prod2._id,
                  name: prod2.name,
                  price: prod2.price,
                  quantity: quantity2,
                  selectedSize: prod2.sizes[1] || 'L',
                }
              ],
              totalPrice: total,
              paymentMethod: ['card', 'upi', 'cod'][Math.floor(Math.random() * 3)],
              paymentStatus: 'Paid',
              status: ['Pending', 'Confirmed', 'Shipped', 'Delivered'][Math.floor(Math.random() * 4)],
              createdAt: date,
            });
          }
        }
        await Order.insertMany(mockOrders);
        console.log('Seeded historical orders for analytical charts.');
      }
    }
  } catch (error) {
    console.error('Error seeding orders:', error.message);
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public (users & guests can checkout)
export const createOrder = async (req, res) => {
  const { guestDetails, items, totalPrice, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in cart' });
  }

  try {
    const orderItems = [];
    for (const item of items) {
      const dbProduct = await Product.findById(item.product._id || item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize || 'M',
      });
    }

    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      guestDetails,
      items: orderItems,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      status: 'Pending',
    });

    let updatedUser = undefined;
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        let isUpdated = false;
        if (guestDetails.phone && user.phone !== guestDetails.phone) {
          user.phone = guestDetails.phone;
          isUpdated = true;
        }
        if (guestDetails.address && user.address !== guestDetails.address) {
          user.address = guestDetails.address;
          isUpdated = true;
        }
        if (guestDetails.city && user.city !== guestDetails.city) {
          user.city = guestDetails.city;
          isUpdated = true;
        }
        if (guestDetails.state && user.state !== guestDetails.state) {
          user.state = guestDetails.state;
          isUpdated = true;
        }
        if (guestDetails.zip && user.zip !== guestDetails.zip) {
          user.zip = guestDetails.zip;
          isUpdated = true;
        }
        if (isUpdated) {
          await user.save();
        }
        updatedUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          city: user.city,
          state: user.state,
          zip: user.zip,
        };
      }
    }

    res.status(201).json({
      message: 'Order placed successfully!',
      order,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin/SuperAdmin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics summary (Admin/SuperAdmin only)
// @route   GET /api/orders/analytics
// @access  Private/Admin
export const getOrderAnalytics = async (req, res) => {
  const { filter } = req.query;
  const daysLimit = filter === 'monthly' ? 30 : 7;

  try {
    const orders = await Order.find({});
    
    // Calculate summaries
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

    const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
    const returnedCount = orders.filter(o => o.status === 'Returned').length;
    const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;
    const defectedCount = orders.filter(o => o.status === 'Defected').length;
    
    // Group orders by date (last N days)
    const dailyData = {};
    const categoriesData = {};

    // Initialize last N days
    for (let i = daysLimit - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyData[dateStr] = { date: dateStr, count: 0, revenue: 0 };
    }

    orders.forEach(order => {
      // 1. Time scale grouping
      const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyData[dateStr]) {
        dailyData[dateStr].count += 1;
        dailyData[dateStr].revenue += order.totalPrice;
      }

      // 2. Product Categories breakdown
      order.items.forEach(item => {
        const cat = item.selectedSize === 'Free Size' ? 'Women' : 'Men'; 
        categoriesData[cat] = (categoriesData[cat] || 0) + item.quantity;
      });
    });

    const timeline = Object.values(dailyData);

    res.json({
      totalOrders,
      totalRevenue,
      deliveredCount,
      returnedCount,
      cancelledCount,
      defectedCount,
      timeline,
      categories: Object.keys(categoriesData).map(k => ({ name: k, value: categoriesData[k] })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    
    // Auto update paymentStatus if delivered
    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete single order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await Order.deleteOne({ _id: req.params.id });
    res.json({ message: 'Order successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear all orders
// @route   DELETE /api/orders
// @access  Private/Admin
export const clearAllOrders = async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: 'All order records successfully cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track order status (Public)
// @route   GET /api/orders/track/:id
// @access  Public
export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Access Control: Allow Admins/SuperAdmins to track any order
    const isAdminUser = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');

    if (!isAdminUser) {
      // If the order has an associated registered user, only that user can track it
      if (order.user) {
        if (!req.user || req.user._id.toString() !== order.user.toString()) {
          return res.status(403).json({ message: 'Access denied. This order belongs to another registered client.' });
        }
      } else {
        // If it is a guest checkout, and a user is logged in, their email must match
        if (req.user && order.guestDetails?.email !== req.user.email) {
          return res.status(403).json({ message: 'Access denied. This guest order belongs to another client.' });
        }
      }
    }

    res.json({
      _id: order._id,
      createdAt: order.createdAt,
      status: order.status,
      items: order.items,
      totalPrice: order.totalPrice,
      guestDetails: {
        name: order.guestDetails?.name
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Invalid Order ID format' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
