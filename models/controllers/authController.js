import { request } from "express"
import User from "../models/User.js"

//user registration
export const register = async (requestAnimationFrame, res) => {
    try{
      const newuser = new User({
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
        photo: request.body.photo,
      })

      await newuser.save()

      res.status(200).json({ success true, message: "Successfully created" })
    } catch (err) {
      res
         .status(300)
         .json({ success: false, message: "Failed to create. Try again"})
    }
}


//user login
export const login = async (requestAnimationFrame, res) => {
    try{

    } catch (err) {}
}