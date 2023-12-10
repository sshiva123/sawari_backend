const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors = require('cors');
const bcrypt=require('bcrypt');
const mongoose = require('mongoose');
app.use(bodyParser.json(),cors())
//importing schemas
const Category=require('./models/category');
const Question=require('./models/question');
const Vehicle=require('./models/vehicle');
//importing routes
const categoryRoute=require('./routes/categoryRoute');
const questionRoute=require('./routes/questionRoute');
const vehicleRoute=require('./routes/vehicleRoute');
const subjectRoute=require('./routes/subjectRoute');
//connecting database
let mongoDB='mongodb+srv://test:passwords@cluster0.iclwy.mongodb.net/Sawari';
mongoose.connect(mongoDB).then(() => console.log('Connected to MongoDB')).catch((error) => console.error(error));
 //Get the default connection
 var db = mongoose.connection;
 //Bind connection to error event (to get notification of connection errors)
 db.on('error', console.error.bind(console, 'MongoDB connection error:'));
 //subjects (made different route for this)
 const subjects=
    ['सवारी सञ्चालन सम्बन्धी ज्ञान','सवारी ऐन नियमसम्बन्धी ज्ञान','सवारी साधनको प्राविधिक तथा यान्त्रिक ज्ञान','वातावरण प्रदूषण सम्बन्धी अवधारणात्मक ज्ञान','दुर्घटना सचेतना सम्बन्धी ज्ञान','ट्राफिक सङ्केत सम्बन्धी ज्ञान'];
 
//routes
app.use('/category',categoryRoute);
app.use('/question',questionRoute);
app.use('/vehicle',vehicleRoute);
app.use('/subject',subjectRoute);

app.get('/',(req,res)=>{
    res.send("Hello");
})
//boot up server
app.listen(5000);

//Special thanks to Bing Chat and ChatGPT😂😂