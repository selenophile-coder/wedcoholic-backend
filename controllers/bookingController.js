import Booking from '../models/Booking.js';

// @desc    Create a new video consultation booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  const { name, phone, email, date, time, designer, style, notes } = req.body;

  try {
    if (!name || !phone || !email || !date || !time || !designer || !style) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const booking = await Booking.create({
      name,
      phone,
      email,
      date,
      time,
      designer,
      style,
      notes,
    });

    res.status(201).json({
      message: 'Exclusive video consultation booked successfully!',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all booked virtual consultations (Admin sees all, normal user sees only theirs)
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      query = { email: req.user.email };
    }
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a video consultation booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  if (!['Pending', 'Approved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value. Must be Pending or Approved.' });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
