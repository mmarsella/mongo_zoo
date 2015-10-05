var mongoose = require("mongoose");
var Animal = require("./animal"); // hook won't know about 
//animal until I require it here!!

var zooSchema = new mongoose.Schema({
  name:String,
  location:String,
  animals: [{
    type: mongoose.Schema.Types.ObjectId, // finds the id of the child
    ref: "Animal"  //refers to model of child
  }]
});


//before removing a zoo, remove all animals in zoo
zooSchema.pre('remove', function(callback) {
    Animal.remove({zoo: this._id}).exec();
    callback();
});


//1st param = model name, will be the name of the collection
// will be used in the refs!!!!


// 2nd param = schema
var Zoo = mongoose.model("Zoo", zooSchema);

module.exports = Zoo;


//TYPE AND REF

