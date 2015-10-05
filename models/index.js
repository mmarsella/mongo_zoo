var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/zoo_app");
mongoose.set('debug',true);  // LOGS ALL database actions in the nodemone tab

module.exports.Animal = require("./animal");
module.exports.Zoo = require("./zoo");