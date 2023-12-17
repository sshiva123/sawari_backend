const express = require('express');
const router = express.Router();
const Question=require('../models/question');
const multer = require ('multer');
let path = require ('path');
const fs = require('fs').promises; //had to use promises

var storage = multer.diskStorage ({
  destination: function (req, file, cb) {
    cb (null, 'uploads/') // specify the destination folder
  },
  filename: function (req, file, cb) {
    cb (null, Date.now () + path.extname (file.originalname)) // specify the filename with extension
  }
})
var upload = multer({
  storage: storage,
  limits: { 
    fileSize: 1000000, // limit the file size to 1MB
    cb: function (err, acceptFile) {
      // create a custom error object with a custom message
      var customError = new Error ('The file size is too large.');
      // pass the custom error object and a false value to the cb function
      cb (customError, false);
    }
  },
  fileFilter: function (req, file, cb) {
    var filetypes = /jpeg|jpg|png/; // specify the allowed file types
    var mimetype = filetypes.test (file.mimetype);
    var extname = filetypes.test (path.extname (file.originalname).toLowerCase ());

    if (mimetype && extname) {
      return cb (null, true);
    }
    cb ("Error: File upload only supports the following filetypes - " + filetypes);
  }
})

//create a new question
router.post ('/', upload.single('imageFile'),async (req,res,next)=> {
  try{
    
        // create a new question object with the file path
    var question = new Question ({
      number:req.body.number,
      categories: req.body.categories,
      subject: req.body.subject,
      question: req.body.question,
      image: { bool: req.file?true:false, imageData: req.file?.filename ?? null },
      options: req.body.options,
      correct: req.body.correct
    });
    // save the question object to the database
    await question.save()
    const populatedQuestion=await Question.populate(question,[{path:'categories'},{path:'subject'}]);

    res.status(200).json({message:"Success",question:populatedQuestion})
  }
  catch(err){
    res.status(500).json({message:"Something went wrong"});
  }
  
},errorHandle);
function errorHandle(err,req,res,next){
    if(err){
      res.status(500).json({message:"Fail"})
      return
    }
    next()
  }

//update the question
router.put('/:id', upload.single('imageFile'), async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (req.file) {
      //delete the old image
      if (question.image.bool ) {
        await fs.unlink(`./uploads/${question.image.imageData}`);
      }
      //update the question with the new image
      question.image = { bool: true, imageData: req.file.filename };
    }
    else {
        if(question.image.bool){
          await fs.unlink(`./uploads/${question.image.imageData}`);
          question.image = { bool: false, imageData: null };
        }
    }
    
    question.number = req.body.number;
    question.categories = req.body.categories;
    question.subject = req.body.subject;
    question.question = req.body.question;
    question.options = req.body.options;
    question.correct = req.body.correct;

    await question.save();

    const populatedQuestion = await Question.populate(question, [
      { path: 'categories' },
      { path: 'subject' }
    ]);

    res.status(200).json({ message: 'Success', question: populatedQuestion });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error });
  }
});

// Get all question
router.get('/', async (req, res) => {
    try {
      const questions = await Question.find().populate('categories').populate('subject');
      res.status(200).json({questions:questions,message:"Success"});
    } catch (error) {
      res.status(500).json({message:"Error",error:error});
    }
  });

  //delete single question
  router.delete('/:id', async (req, res) => {
    try {
      const question = await Question.findByIdAndDelete(req.params.id);
      console.log(question)
      if(question.image.bool) {await fs.unlink('./uploads/'+question.image.imageData)};
      res.status(200).json({question:question,message:"Success"});
    } catch (error) {
      res.status(500).json({message:"Error",error:error});
    }
  });
  module.exports = router;

  