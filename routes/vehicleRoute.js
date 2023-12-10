const express = require('express');
const router = express.Router();
const Vehicle=require('../models/vehicle');

//create a new vehicle
router.post('/',async(req,res)=>{
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();
        res.status(201).json({vehicle:vehicle,message:"Success"});
      } catch (error) {
        res.status(400).json({message:"Something went wrong!"});
      }
})
// Get all vehicle
router.get('/', async (req, res) => {
    try {
      const vehicles = await Vehicle.find();
      res.status(200).json({vehicles:vehicles,message:"Success"});
    } catch (error) {
      res.status(500).json({message:"Error",error:error});
    }
  });
  // Delete a vehicle
router.delete('/:vehicleId', async (req, res) => {
  try {
      const removedVehicle = await Vehicle.deleteOne({ _id: req.params.vehicleId });
      res.status(200).json({vehicle:removedVehicle,message:"Success"});
  } catch (err) {
      res.status(500).json({ message:"Failed",error:err });
  }
});
  module.exports = router;