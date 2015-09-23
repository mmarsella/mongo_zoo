var mongoose = require("mongoose");

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

var Zoo = mongoose.model("Zoo", zooSchema);

module.exports = Zoo;