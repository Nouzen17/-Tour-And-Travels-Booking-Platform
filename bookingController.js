import Booking from '../models/Booking.js';


// Create a new booking
export const createBooking = async (req, res) => {
    const newBooking = new Booking(req.body);
    try {
        const savedBooking = await newBooking.save();
        res
           .status(200)
           .json({
            success: true,
            message: "Your Tour is booked",
            data: savedBooking,
           });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Booking failed",
                error: error.message,
            });
        }
    };
    

    //get single booking

    export const getBooking = async (req, res) => {
        const id = req.params.id;
        try {
            const book = await Booking.findById(id);
            res.status(200).json({
                success: true,
                message: "Successful",
                data: book,
            });
        } catch (error) {
            res.status(404).json({
                success: true,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    };

    //get all booking

    export const getAllBooking = async (req, res) => {
        try {
            const book = await Booking.find();
            res.status(200).json({
                success: true,
                data: book,
            });
        } catch (error) {
            res.status(404).json({
                success: true,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    };


