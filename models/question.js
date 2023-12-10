const mongoose =require('mongoose');
const QuestionSchema=mongoose.Schema({
    "categories":[{type:mongoose.Schema.Types.ObjectId,ref:'Category'}],
    "subject":{type:mongoose.Schema.Types.ObjectId,ref:'Subject'},
    "question":{type:String},
    "image":{"bool":Boolean,imageData:String},
    "options":[{type:String}],
    "correct":{type:String}
})
module.exports=mongoose.model('Question',QuestionSchema);