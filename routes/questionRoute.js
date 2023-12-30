const express = require('express');
const router = express.Router();
const Question=require('../models/question');
const multer = require ('multer');
const path = require ('path');
const fs = require('fs').promises; //had to use promises
const aws =require("aws-sdk");
const formidable=require('express-formidable')
const multerS3 = require('multer-s3');
//testing storj
const accessKeyId = "jw4zpzjfpurpkzyuzohzgoqkntbq";
const secretAccessKey = "jzvr25ymuwtjrbh6pvgghwuaevuxm6um6bdjjiua23sygvhovc52k";
const endpoint = "https://gateway.storjshare.io";

aws.config.update({
  accessKeyId,
  secretAccessKey,
  endpoint,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
  connectTimeout: 0,
  httpOptions: { timeout: 0 }
});
const s3 = new aws.S3();
  // LocalStorage code... doesnot work with vercel
                  var storage = multer.diskStorage ({
                    destination: function (req, file, cb) {
                      cb (null, 'uploads/') // specify the destination folder
                    },
                    filename: function (req, file, cb) {
                      cb (null, Date.now () + path.extname (file.originalname)) // specify the filename with extension
                    }
                  })
                  const upload = multer({
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
//storj multer code:
                  const uploadStorj = multer({
                    storage: multerS3({
                      s3: s3,
                      bucket: 'sawari',
                      key: function (req, file, cb) {
                                let customFileName = Date.now(),
                                fileExtension = path.extname(file.originalname);
                                cb(null, customFileName + fileExtension);
                      }
                    }),
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
                  });
//create a new question
router.post ('/oldLocalMethod', upload.single('imageFile'),async (req,res,next)=> { //saves uploaded file to local storage of server planning to deprecate this method 
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
//old method end
//new add method using Storj AWS BUCKET
router.post ('/',uploadStorj.single('imageFile'),async (req,res,next)=> {
  try{
    let imageData="";
    if(req.file){
      const params = {
        Bucket: "sawari",
        Key: req.file.key
      }
      
      //imageUrl = s3.getSignedUrl("getObject", params);
      imageData=req.file.key;
    }
        // create a new question object with the file path
    var question = new Question ({
      number:req.body.number,
      categories: req.body.categories,
      subject: req.body.subject,
      question: req.body.question,
      image: { bool: req.file?true:false, imageData: imageData },
      options: req.body.options,
      correct: req.body.correct
    });
    // save the question object to the database
    await question.save()
    const populatedQuestion=await Question.populate(question,[{path:'categories'},{path:'subject'}]);

    res.status(200).json({message:"Success",question:populatedQuestion})
  }
  catch(err){
    console.log("tait")
    res.status(500).json({message:"Something went wrong"});
  }
  
});
function errorHandle(err,req,res,next){
    if(err){
      res.status(500).json({message:"Fail"})
      return
    }
    next()
  }

//update the question
router.put('/:id', uploadStorj.single('imageFile'), async (req, res) => {
  try {
    req.body.image=JSON.parse(req.body.image);
    const question = await Question.findById(req.params.id);

    if (req.file) {
      //delete the old image
      if (question.image.bool ) {
        //await fs.unlink(`./uploads/${question.image.imageData}`);
        const params = {
          Bucket: 'sawari',
          Key: question.image.imageData
        };

        // Delete the file
        s3.deleteObject(params, function(err, data) {
          if (err) console.log(err, err.stack);  // error
          else     console.log("Successfully deleted file from bucket");                 // deleted
        });
      }
      //update the question with the new image
      question.image = { bool: true, imageData: req.file.key };
    }
    else {
        if(!req.body.image.bool && question.image.bool){
         // await fs.unlink(`./uploads/${question.image.imageData}`);
         // Set up the parameters for the delete operation
          const params = {
            Bucket: 'sawari',
            Key: question.image.imageData
          };
          // Delete the file
          s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack);  // error
            else     console.log("Successfully deleted file from bucket");                 // deleted
          });
         question.image = { bool: false, imageData: '' };
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

  