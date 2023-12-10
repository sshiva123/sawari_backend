const mongoose=require('mongoose');

const VehicleSchema=mongoose.Schema({
    "name":{type:String}
})

module.exports=mongoose.model('Vehicle',VehicleSchema);
