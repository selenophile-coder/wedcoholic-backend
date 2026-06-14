import Product from '../models/Product.js';

// Seed initial products from data.js if collection is empty
export const seedInitialProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const STARTING_PRODUCTS = [
        {
          name: 'Grand Ivory Sherwani',
          category: 'Men',
          price: 45000,
          image: '/images/products/1774861981073groom-essentials.webp',
          badge: 'Heritage Classic',
          description: 'A timeless ivory sherwani adorned with intricate tilla embroidery, handcrafted for the modern groom. Made from luxurious raw silk, featuring custom hand-forged metallic brass buttons and a sharp contemporary collar silhouette.',
          highlights: ['100% Premium Raw Silk', 'Sovereign Brass Buttons', 'Handcrafted Custom Quilting', 'Comes with matching Churidar'],
          designer: 'Manyavar Mohey',
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          isNew: false,
          celebrityCloset: true,
          occasions: ['The Wedding', 'For Groom Big Day'],
          discount: 15
        },
        {
          name: 'The Kurta Jacket Edit',
          category: 'Men',
          price: 22000,
          image: '/images/whatsnew/1774861981073groom-essentials.webp',
          badge: 'Popular Choice',
          description: 'A bespoke silk kurta paired with a highly structured textured bundi jacket. Finished with a subtle self-pattern weave that catches the light beautifully at evening engagements.',
          highlights: ['Micro-textured Khadi Silk Blend', 'Pocket Square Accent Included', 'Mandarin Collar Styling', 'Mid-thigh length classic drape'],
          designer: 'Playfair Mohey',
          sizes: ['S', 'M', 'L', 'XL'],
          isNew: true,
          celebrityCloset: false,
          occasions: ['Haldi Rasam', 'Mehendi Moments', 'Sangeet'],
          discount: 10
        },
        {
          name: 'Deep Tone Bandhgala',
          category: 'Men',
          price: 38000,
          image: '/images/occasions/1774948127503reception.avif',
          badge: 'Midnight Royal',
          description: 'Exquisitely structured bandhgala suit in a deep charcoal burgundy hue. Intended for absolute presence, it couples classic imperial cuts with sophisticated contemporary minimalist tailoring.',
          highlights: ['Royal Premium Italian Crepe', 'Detailed hand-stitched piping', 'Sleek concealed functional pockets', 'Imperial slim-fit trouser set'],
          designer: 'Ridhi Mehra',
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          isNew: false,
          celebrityCloset: true,
          occasions: ['Reception', 'Roka Ceremony'],
          discount: 20
        },
        {
          name: 'Mirrorwork Festive Edit',
          category: 'Men',
          price: 28000,
          image: '/images/whatsnew/1774861981073groom-essentials.webp',
          badge: 'New Arrival',
          description: 'An outstanding festive design bearing precise mirror thread detailing on the yoke. Paired seamlessly with a soft premium georgette underlayer for supreme all-day movement comfort.',
          highlights: ['Reflective mirror motif layout', 'Breathable lightweight construction', 'Georgette & Viscose blend', 'Slightly flared modern hemline'],
          designer: 'Aza Editorials',
          sizes: ['M', 'L', 'XL'],
          isNew: true,
          celebrityCloset: false,
          occasions: ['Mehendi Moments', 'Haldi Rasam', 'Sangeet'],
          discount: 15
        },
        {
          name: 'Romantic Fuchsia Couture Lehenga',
          category: 'Lehengas',
          price: 125000,
          image: '/images/products/1773662540730multi-coloured-lehenga-edit.webp',
          badge: 'Couture Masterpiece',
          description: 'Enchanting romantic couture tailored with a modern spirit. This exquisite fuchsia pink bridal set highlights heavy hand-done Resham work, floral motifs, and a spectacular sheer silk dupatta.',
          highlights: ['Pure Hand-done Zardozi', 'Premium Chanderi Silk fabric base', 'Signature Ridhi Mehra styling with modern cutouts', 'Includes custom embellished corset blouse'],
          designer: 'Ridhi Mehra',
          sizes: ['XS', 'S', 'M', 'L'],
          isNew: false,
          celebrityCloset: true,
          occasions: ['The Wedding', 'For Bride Big Day'],
          discount: 25
        },
        {
          name: 'Emerald Heritage Anarkali',
          category: 'Women',
          price: 64000,
          image: '/images/whatsnew/1773662608426statement-sharara-sets.webp',
          badge: 'Heritage Campaign',
          description: 'A deep forest emerald green masterpiece illustrating ancestral weaving. Adorned with delicate vintage gold thread border details that define understated heritage elegance.',
          highlights: ['Handwoven Banarasi Silk trim', 'Chiffon sheer long length flow', 'Comfort fit empire cut', 'Comes with heavily matching churidar'],
          designer: 'Ridhi Mehra',
          sizes: ['S', 'M', 'L', 'XL'],
          isNew: true,
          celebrityCloset: false,
          occasions: ['Mehendi Moments', 'Reception'],
          discount: 10
        },
        {
          name: 'Zardozi Bridal Saree',
          category: 'Wedding',
          price: 89000,
          image: '/images/hero/1774946941021the-wedding.avif',
          badge: 'Bridal Selection',
          description: 'An ancestral crimson wedding saree woven inside authentic Banaras handlooms. Every centimeter reflects the magnificent master weaving that honors traditional craftsmanship with a majestic drape.',
          highlights: ['Royal crimson color signature', 'Real gold polished tilla threads', 'Includes custom matching blouse material', 'Weighted luxury fall draping'],
          designer: 'Manyavar Mohey',
          sizes: ['Free Size'],
          isNew: false,
          celebrityCloset: true,
          occasions: ['The Wedding', 'For Bride Big Day'],
          discount: 15
        },
        {
          name: 'Princes Miniature Velvet Sherwani',
          category: 'Kids',
          price: 15500,
          image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
          badge: 'Kids Royal',
          description: 'Premium soft velvet mini sherwani tailored purposefully for absolute comfort and unrestricted movement. Outfitted with safe soft linings and kid-friendly zip-closure back styling.',
          highlights: ['Extremely child-safe organic cotton lining', 'No-scratch gold elements', 'Elasticated soft pajama trousers', 'Pre-draped side pocket styling'],
          designer: 'Vedant Fashions',
          sizes: ['4-5 Yrs', '6-7 Yrs', '8-9 Yrs', '10-11 Yrs'],
          isNew: false,
          celebrityCloset: false,
          occasions: ['The Wedding', 'Reception'],
          discount: 5
        },
        {
          name: 'Festive Pastel Gown Set',
          category: 'Kids',
          price: 12800,
          image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80',
          badge: 'Festive Little Ones',
          description: 'A gorgeous ethnic tiered pastel peach dress for girls. Styled using premium soft tissue georgette, complete with lightweight floral appliques and standard matching sheer organza dupatta.',
          highlights: ['Micro-jersey inner top layers', 'Allergy-free synthetic borders', 'Lightweight and wrinkle-proof', 'Comes with adjustable satin belt sash'],
          designer: 'Aza Editorials',
          sizes: ['4-5 Yrs', '6-7 Yrs', '8-9 Yrs'],
          isNew: true,
          celebrityCloset: false,
          occasions: ['Mehendi Moments', 'Haldi Rasam', 'Sangeet'],
          discount: 20
        },
        {
          name: 'Abstract Contemporary Lehenga Set',
          category: 'Designers',
          price: 140000,
          image: '/images/whatsnew/1773662540730multi-coloured-lehenga-edit.webp',
          badge: 'Designer Elite',
          description: 'A rare collaboration design that infuses minimalist patterns into traditional lehenga shapes. Truly destined for fashion-forward weddings where artistic distinction is non-negotiable.',
          highlights: ['Exclusively handmade to order', 'Premium silk organza multilayer skirt', 'Structured modern bustier corset', 'Signed by Chef de Design Ridhi Mehra'],
          designer: 'Ridhi Mehra',
          sizes: ['S', 'M', 'L'],
          isNew: true,
          celebrityCloset: true,
          occasions: ['The Wedding', 'Reception', 'Sangeet'],
          discount: 30
        }
      ];

      await Product.insertMany(STARTING_PRODUCTS);
      console.log('Seeded standard boutique products collection');
    }
  } catch (error) {
    console.error('Error seeding products:', error.message);
  }
};

// @desc    Get all products (with search filtering)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  const { category, occasion, search } = req.query;
  const filterQuery = {};

  if (category && category !== 'All') {
    filterQuery.category = category;
  }

  if (occasion && occasion !== 'All') {
    filterQuery.occasions = occasion;
  }

  if (search) {
    filterQuery.$or = [
      { name: { $regex: search, $options: 'i' } },
      { designer: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const products = await Product.find(filterQuery);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product (Admin/SuperAdmin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const {
    name,
    category,
    price,
    image,
    badge,
    description,
    highlights,
    designer,
    sizes,
    isNew,
    celebrityCloset,
    occasions,
    discount,
    rating,
  } = req.body;

  try {
    const product = await Product.create({
      name,
      category,
      price,
      image: image || '/images/products/1774861981073groom-essentials.webp',
      badge,
      description,
      highlights: Array.isArray(highlights) ? highlights : highlights ? highlights.split(',').map(h => h.trim()) : [],
      designer,
      sizes: Array.isArray(sizes) ? sizes : sizes ? sizes.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL'],
      isNew: isNew === 'true' || isNew === true,
      celebrityCloset: celebrityCloset === 'true' || celebrityCloset === true,
      occasions: Array.isArray(occasions) ? occasions : occasions ? occasions.split(',').map(o => o.trim()) : [],
      discount: Number(discount) || 0,
      rating: Number(rating) || 5.0,
    });

    res.status(201).json({
      message: 'Product successfully added',
      product,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product (Admin/SuperAdmin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const {
    name,
    category,
    price,
    image,
    badge,
    description,
    highlights,
    designer,
    sizes,
    isNew,
    celebrityCloset,
    occasions,
    discount,
    rating,
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name ?? product.name;
    product.category = category ?? product.category;
    product.price = price ?? product.price;
    product.image = image ?? product.image;
    product.badge = badge ?? product.badge;
    product.description = description ?? product.description;
    product.designer = designer ?? product.designer;
    product.isNew = isNew !== undefined ? (isNew === 'true' || isNew === true) : product.isNew;
    product.celebrityCloset = celebrityCloset !== undefined ? (celebrityCloset === 'true' || celebrityCloset === true) : product.celebrityCloset;
    product.discount = discount !== undefined ? Number(discount) : product.discount;
    product.rating = rating !== undefined ? Number(rating) : product.rating;

    if (highlights !== undefined) {
      product.highlights = Array.isArray(highlights) ? highlights : highlights.split(',').map(h => h.trim());
    }
    if (sizes !== undefined) {
      product.sizes = Array.isArray(sizes) ? sizes : sizes.split(',').map(s => s.trim());
    }
    if (occasions !== undefined) {
      product.occasions = Array.isArray(occasions) ? occasions : occasions.split(',').map(o => o.trim());
    }

    const updatedProduct = await product.save();
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product (Admin/SuperAdmin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
