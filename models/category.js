const mongoose=require('mongoose');

const CategorySchema=mongoose.Schema({
    "categoryLetter":{type:String},
    "vehicles":[{type:mongoose.Schema.Types.ObjectId,ref:'Vehicle'}]
})

module.exports=mongoose.model('Category',CategorySchema);
