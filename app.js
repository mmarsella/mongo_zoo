var express = require('express'),
  app = express();
  bodyParser = require("body-parser");  
  methodOverride = require('method-override');
var db = require("./models");

app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

/***** ZOO ROUTES *****/

//ROOT
app.get("/", function (req,res){
  res.redirect("zoos");
});

//INDEX
app.get("/zoos", function (req,res){
  //find all zoos, populate page
  db.Zoo.find({}, function (err, zoos){
    res.render("index", {zoos:zoos});
  });
});




































// start the server
app.listen(3000, function () {
  console.log("Starting a server on localhost:3000");
  });