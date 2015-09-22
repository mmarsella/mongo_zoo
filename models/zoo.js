var mongoose = require("mongoose");

var zooSchema = new mongoose.Schema({
  name:String,
  location:String,
  animals: {
    type: mongoose.Schema.Types.ObjectId, // finds the id of the child
    ref: "Animal"  //refers to model of child
  }
});

var Zoo = mongoose.model("Zoo", zooSchema);

module.exports = Zoo;