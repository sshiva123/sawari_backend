const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors = require('cors');
const bcrypt=require('bcrypt');
const mongoose = require('mongoose');
app.use(bodyParser.json(),cors())
require('dotenv').config();
//passport jwt
require('./passport/auth');
const authUser=require('./middlewares/authUser')['authenticate_user'];
//importing schemas
const Category=require('./models/category');
const Question=require('./models/question');
const Vehicle=require('./models/vehicle');
const User=require('./models/user');
//importing routes
const categoryRoute=require('./routes/categoryRoute');
const questionRoute=require('./routes/questionRoute');
const vehicleRoute=require('./routes/vehicleRoute');
const subjectRoute=require('./routes/subjectRoute');
const userRoute=require('./routes/userRoute');
const authRoute=require('./routes/authRoute');
//connecting database
let mongoDB=process.env.MONGO_DB_URL;
mongoose.connect(mongoDB).then(() => console.log('Connected to MongoDB')).catch((error) => console.error(error));
 //Get the default connection
 var db = mongoose.connection;
 //Bind connection to error event (to get notification of connection errors)
 db.on('error', console.error.bind(console, 'MongoDB connection error:'));
 //subjects (made different route for this)
 const subjects=
    ['सवारी सञ्चालन सम्बन्धी ज्ञान','सवारी ऐन नियमसम्बन्धी ज्ञान','सवारी साधनको प्राविधिक तथा यान्त्रिक ज्ञान','वातावरण प्रदूषण सम्बन्धी अवधारणात्मक ज्ञान','दुर्घटना सचेतना सम्बन्धी ज्ञान','ट्राफिक सङ्केत सम्बन्धी ज्ञान'];
 //to send static files
 app.use(express.static('uploads'))
//routes
app.use('/category',authUser,categoryRoute);
app.use('/question',authUser,questionRoute);
app.use('/vehicle',authUser,vehicleRoute);
app.use('/subject',authUser,subjectRoute);
app.use('/user',authUser,userRoute);
app.use('/auth',authRoute);
app.get('/',(req,res)=>{
    res.send("Hello");
})
//boot up server
app.listen(5000);

//Special thanks to Bing Chat and ChatGPT😂😂