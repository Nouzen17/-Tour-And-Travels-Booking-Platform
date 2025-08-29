import Booking from "../models/Booking.js";

// @desc    Create a new booking
// @route   POST /api/v1/booking
// @access  Private (authenticated users only)
export const createBooking = async (req, res) => {
  // Get user information from the verified token (added by verifyToken middleware)
  const userId = req.user.id;
  const userEmail = req.user.email;

  // Create booking with user information and form data
  const newBooking = new Booking({
    ...req.body,
    userId,
    userEmail,
  });

  try {
    const savedBooking = await newBooking.save();

    res.status(200).json({
      success: true,
      message: "Your tour is booked!",
      data: savedBooking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Failed to book tour.",
    });
  }
};

// We can add functions to get a single booking and all bookings later if needed for the admin panel.
