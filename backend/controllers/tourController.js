import Tour from '../models/Tour.js'
import { router } from '../routes/tours.js'


//create new tour
export const createTour = async (req,res)=>{

    const newTour = new Tour(req.body)

    try {
        const savedTour = await newTour.save()

        res.status(200).json({success:true, 
        message:'Sucessfully created',
        data:savedTour})

    } catch (err) {
        res.status(500).json({
            success:false, 
            message:'Failed to create. Try again'});
        
    }
}

//update tour
export const updateTour = async(req,res)=>{

    const id = req.params.id
    try {
      const updatedTour = await Tour.findByIdAndUpdate(id,{
        $set: req.body
      },{new: true})

    res.status(200).json({
        success:true, 
        message:'Sucessfully updated',
        data: updatedTour})


    } catch (err) {
        res.status(500).json({
            success:false, 
            message:'Failed to update. Try again'});
        
    }
}

//delete tour
export const deleteTour = async(req,res)=>{
    const id = req.params.id
    try {
      await Tour.findByIdAnddelete(id);

    res.status(200).json({
        success:true, 
        message:'Sucessfully deleted'});


    } catch (err) {
        res.status(500).json({
            success:false, 
            message:'Failed to delete. Try again'});
        
    }
}

//getSingle tour
export const getSingleTour = async(req,res)=>{
    try {
        
    } catch (err) {
        
    }
}//getAll tour
export const getAllTour = async(req,res)=>{
    try {
        
    } catch (err) {
        
    }
}
