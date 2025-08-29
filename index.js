import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import tourRoute from "./routes/tours.js";
import bookingRoute from "./routes/bookings.js";
import authRoute from "./routes/auth.js";



dotenv.config();
const app = express();
const port = process.env.PORT || 1530;

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};

//for testing
app.get("/api/test", (req, res) => {
    res.send("API is working");
});

app.post("/api/register", (req, res) => {
    const { username, email, password } = req.body;
    // Handle user registration logic here
    res.send("User registered successfully");
});

//database connection
mongoose.set('strictQuery', false);
const connect = async()=>{
        try {
                await mongoose.connect(process.env.MONGO_URI);
                console.log('MongoDB database connected');
        } catch (err) {
            console.log('MongoDB database connection failed');
        }
};
//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/bookings", bookingRoute);



app.listen(port, ()=>{
    connect();
    console.log('server listening on port',port);

});
