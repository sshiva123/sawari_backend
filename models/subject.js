const mongoose =require('mongoose');
const SubjectSchema=mongoose.Schema({
    name:{type:String,required:true},
    number:{type:Number,required:true},
})
module.exports=mongoose.model('Subject',SubjectSchema);