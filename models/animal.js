var mongoose = require("mongoose");
// var Zoo = require("./zoo");

var animalSchema = new mongoose.Schema({
    name:String,
    species:String,
    age:String,
    photo:String,
    zoo:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zoo"  // refers to the parent
    }
});

var Animal = mongoose.model("Animal", animalSchema);
module.exports = Animal;