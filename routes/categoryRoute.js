const express = require('express');
const router = express.Router();
const Category=require('../models/category');

//create a new category
router.post('/',async(req,res)=>{
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({category:category,message:"Success"});
      } catch (error) {
        res.status(400).json({message:"Something went wrong!"});
      }
})
// Get all category
router.get('/', async (req, res) => {
    try {
      const categories = await Category.find().populate('vehicles');
      res.status(200).json({categories:categories,message:"Success"});
    } catch (error) {
      res.status(500).json({message:"Error",error:error});
    }
  });
  //delete category
  router.delete('/:categoryId', async (req, res) => {
    try {
        const removedCategory = await Category.deleteOne({ _id: req.params.categoryId });
        res.status(200).json({category:removedCategory,message:"Success"});
    } catch (err) {
        res.status(500).json({ message: "Failed",error:err });
    }
});
router.put('/update/:categoryId', async (req, res) => {
  try {
     const updatedCategory = await Category.findByIdAndUpdate(
       req.params.categoryId,
       { $set: req.body },
       { new: true }
     );
 
     if (!updatedCategory) {
       return res.status(404).json({message:"Failed",error:"Category not Found"});
     }
 
     res.status(200).json({message:"Success",category:updatedCategory});
  } catch (error) {
     res.status(500).json({message:"Failed",error:"Something went wrong"});
  }
 });
  // Route to remove a single vehicle from the vehicles array in category schema
  router.put('/removeVehicle', async (req, res) => {
  
    try {
      
      // Pull the vehicle with the given vehicleId from the vehicles array of the category with the given categoryId
      const category = await Category.findOneAndUpdate(
        { _id: req.body.categoryId },
        { $pull: { vehicles: req.body.vehicleId } },
        { new: true }
      );
        
      // If the category was not found, return an error message
      if (!category) {
        return res.status(404).json({message:"Failed",error:"Category not Found"});
      }
      // Return a success message
      res.status(200).json({message:"Success",category:category});
    } catch (error) {
      res.status(500).json({message:"Faileds",err:"Something went wrong"});
    }
  });
  // Route to add a single vehicle to the vehicles array in category schema
  router.put('/addVehicle', async (req, res) => {
    try {
      // Push the vehicle with the given vehicleId into the vehicles array of the category with the given categoryId
      const category = await Category.findOneAndUpdate(
        { _id: req.body.categoryId },
        { $push: { vehicles: req.body.vehicleId } },
        { new: true }
      );
  
      // If the category was not found, return an error message
      if (!category) {
        return res.status(404).json({ message: "Failed", error: "Category not Found" });
      }
  
      // Return a success message
      res.status(200).json({ message: "Success", category: category });
    } catch (error) {
      res.status(500).json({ message: "Failed", err: "Something went wrong" });
    }
  });
  module.exports = router;