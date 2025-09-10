import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    tourName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    guestSize: {
      type: Number,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    bookAt: {
      type: Date,
      required: true,
    },

    // models/Booking.js
    //new 
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "confirmed" },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },

  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
