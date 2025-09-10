import Booking from "../models/Booking.js";


// @desc    Create a new booking
// @route   POST /booking
// @access  Private (authenticated users only)
export const createBooking = async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;

  const newBooking = new Booking({
    ...req.body,
    userId,
    userEmail,
  });

  try {
    const savedBooking = await newBooking.save();
    return res.status(200).json({
      success: true,
      message: "Your tour is booked!",
      data: savedBooking,
    });
  } catch (err) {
    console.error("createBooking error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to book tour.",
    });
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /booking/me
// @access  Private
export const getMyBooking = async (req, res) => {
  try {
    const uid = req?.user?.id ? String(req.user.id) : null;
    const email = req?.user?.email || null;

    if (!uid && !email) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // Your schema stores userId, userEmail as String. Match either.
    const bookings = await Booking.find({
      $or: [{ userId: uid }, { userEmail: email }],
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    console.error("getMyBooking error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Failed to fetch bookings" });
  }
};
// UPDATE my booking (date, guestSize, phone)
export const updateMyBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userIdFromToken = String(req.user.id);

    // Only allow specific fields to be updated
    const allowed = {};
    if (req.body.bookAt !== undefined) {
      const d = new Date(req.body.bookAt);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid date" });
      }
      // Optional: block past dates
      const today = new Date(); today.setHours(0,0,0,0);
      if (d < today) {
        return res.status(400).json({ success: false, message: "Date cannot be in the past" });
      }
      allowed.bookAt = d;
    }
    if (req.body.guestSize !== undefined) {
      const gs = Number(req.body.guestSize);
      if (!Number.isInteger(gs) || gs < 1) {
        return res.status(400).json({ success: false, message: "guestSize must be a positive integer" });
      }
      allowed.guestSize = gs;
    }
    if (req.body.phone !== undefined) {
      allowed.phone = req.body.phone;
    }

    // Find booking and ensure ownership
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (String(booking.userId) !== userIdFromToken) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    Object.assign(booking, allowed);
    const saved = await booking.save();

    return res.status(200).json({ success: true, message: "Booking updated", data: saved });
  } catch (err) {
    console.error("updateMyBooking error:", err);
    return res.status(500).json({ success: false, message: "Failed to update booking" });
  }
};

// DELETE my booking
export const deleteMyBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userIdFromToken = String(req.user.id);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (String(booking.userId) !== userIdFromToken) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await booking.deleteOne();

    return res.status(200).json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error("deleteMyBooking error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete booking" });
  }
};

// controllers/bookingController.js
export const cancelMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (String(booking.userId) !== String(req.user.id))
      return res.status(403).json({ success: false, message: "Forbidden" });

    if (booking.status === "cancelled") {
      return res.status(200).json({ success: true, message: "Already cancelled", data: booking });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    if (req.body.reason) booking.cancellationReason = req.body.reason;

    const saved = await booking.save();
    return res.status(200).json({ success: true, message: "Booking cancelled", data: saved });
  } catch (err) {
    console.error("cancelMyBooking error:", err);
    return res.status(500).json({ success: false, message: "Failed to cancel booking" });
  }
};

