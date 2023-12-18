const express = require('express');
const router = express.Router();
const Subject=require('../models/subject');

//create a new question
router.post('/',async(req,res)=>{
    try {
      
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).json({subject:subject,message:"Success"});
      } catch (error) {
        res.status(400).json({message:"Something went wrong!"});
      }
})
// Get all question
router.get('/', async (req, res) => {
    try {
      const subjects = await Subject.find();
      res.status(200).json({subjects:subjects,message:"Success"});
    } catch (error) {
      res.status(500).json({message:"Error",error:error});
    }
  });
  module.exports = router;
  