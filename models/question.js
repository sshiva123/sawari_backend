const mongoose =require('mongoose');
const QuestionSchema=mongoose.Schema({
    "number":{type:Number,required:true},
    "categories":[{type:mongoose.Schema.Types.ObjectId,ref:'Category'}],
    "subject":{type:mongoose.Schema.Types.ObjectId,ref:'Subject',required:true},
    "question":{type:String,required:true},
    "image":{"bool":Boolean,'imageData':String},
    "options":[{type:String}],
    "correct":{type:String}
})

module.exports=mongoose.model('Question',QuestionSchema);