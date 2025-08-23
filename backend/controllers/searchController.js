import Tour from "../models/Tour.js";

// Search tours by destination, max distance, and guest number
export const searchTours = async (req, res) => {
try {
const { destination, maxDistance, guestNumber } = req.query;

let filters = {};

if (destination) {
filters.destination = { $regex: destination, $options: "i" }; // case-insensitive match
}

if (guestNumber) {
filters.maxGroupSize = { $gte: Number(guestNumber) };
}

if (maxDistance) {
filters.distance = { $lte: Number(maxDistance) };
}

const tours = await Tour.find(filters);

res.status(200).json({
success: true,
count: tours.length,
data: tours,
});
} catch (err) {
res.status(500).json({ success: false, message: "Failed to search tours" });
}
};
