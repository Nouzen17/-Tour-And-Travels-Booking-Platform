import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"

import tourRoute from './routes/tours.js'
import reviewRoute from './routes/review.js'
import searchRoute from './routes/search.js'
import userRoute from './routes/user.js'
import authRoute from './routes/auth.js'


dotenv.config()
const app = express()
const port = process.env.PORT || 1530;

//database connection
mongoose.set('strictQuery', false);
const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
        })

        console.log('MongoDB database connected')
    } catch (err) {
      console.log('MongoDB database connection failed' )
        
    }
}


//middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use('/tours', tourRoute);
app.use('/review', reviewRoute);
app.use('/search', searchRoute);
app.use('/user', userRoute);
app.use('/auth', authRoute);

app.listen(port, ()=>{
    connect();
    console.log('server listening on port',port)

})