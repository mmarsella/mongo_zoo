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
    res.render("zoos/index", {zoos:zoos});
  });
});

//NEW
app.get("/zoos/new", function (req,res){
  res.render("zoos/new");
});

//CREATE
   // simply create the parent doc.  Don't worry about child/child field here (animals)
app.post("/zoos", function (req,res){
  db.Zoo.create({name:req.body.name, location:req.body.location}, function (err, zoo){
    if(err){
      console.log(err);
      res.render("zoos/new");
    }else{
      console.log(zoo);  // log the new animal
      res.redirect("/zoos");  // go back to index page
    }
  });
});

//SHOW
app.get("/zoos/:id", function (req,res){
  db.Zoo.findById(req.params.id, function (err, zoo){
    if(err){
      console.log(err);
      res.render("404");
    }else{
      console.log(zoo);
      res.render("zoos/show", {zoo:zoo});
    }
  });
});

//EDIT
app.get("/zoos/:id/edit", function (req,res){
  db.Zoo.findById(req.params.id, function (err,zoo){
    if(err){
      console.log(err);
      res.render("404");
    }else{
      res.render("zoos/edit", {zoo:zoo});
    }
  });
});

//UPDATE
app.post("/zoos/:id", function (req,res){
  // this can be refactored to key:value refs, calling the req.body.zoos
  db.Zoo.findByIdAndUpdate(req.params.id,{name:req.body.name, location:req.body.location}, function (err, zoo){
    if(err){
      console.log(err);
      res.render("404");
    }else{
      res.redirect("/zoos");  // after editing, go back to main page
    }
  });
});

//DELETE
app.delete("/zoos/:id", function (req,res){
  db.Zoo.findById(req.params.id, function (err, zoo){
    if(err){
      console.log(err);
      res.render("404"); //something wrong happens -- 404
    }else{
      animals.remove();
      res.redirect("/zoos");
    }
  });
});



/**** Animal ROUTES ******/






























// 404 CATCH ALL
app.get("*", function (req,res){
  res.render("404");
});

// start the server
app.listen(3000, function () {
  console.log("Starting a server on localhost:3000");
  });