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
  db.Zoo.findById(req.params.id).populate("animals").exec(function (err, zoo){
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
app.put("/zoos/:id", function (req,res){
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
      zoo.remove();
      res.redirect("/zoos");
    }
  });
});


/**** ANIMAL ROUTES ******/

//INDEX
app.get("/zoos/:zoo_id/animals", function (req,res){
  //find all animals, populate page
  db.Zoo.findById(req.params.zoo_id).populate("animals").exec(function(err, zoo){
    res.render("animals/index", {zoo:zoo}); // grabbing the zoo, can call animals from zoo in ejs
  });
});

//NEW
app.get("/zoos/:zoo_id/animals/new", function (req,res){
  db.Zoo.findById(req.params.zoo_id, function (err, zoo){
    res.render("animals/new", {zoo:zoo});
  });
});

//CREATE
app.post("/zoos/:zoo_id/animals", function (req,res){ 
  db.Animal.create(req.body, function (err, animal){  // references the animal just created
    console.log("THE ANIMAL: " + animal); //see if animal is created
    if(err){
      console.log(err);
      res.render("/zoos/new");
    }else{
      db.Zoo.findById(req.params.zoo_id, function (err,zoo){
       console.log("ZOO: " + zoo);
        zoo.animals.push(animal); // push the new animal into the book array
        console.log("ANIMAL ARRAY: " + zoo.animals);
        animal.zoo = zoo._id; // set the ref id inside animal to the zoo's id
        animal.save(); //save the animal creation
        zoo.save(); // save the zoo collection
        res.redirect("/zoos/"+ req.params.zoo_id + "/animals");
        // redirect to the specific animals
      });
    }
 });
});

//SHOW
app.get("/animals/:id", function (req,res){
  db.Animal.findById(req.params.id)
   .populate("zoo")  // POPULATE:  A method called on whatevr the query returns.  Find something AND THEN populate the information.
    // the param populates all the info of zoo inside the animal
    // it also creates an object within that field, instead of only referencing the id.
   .exec(function(err,animal){  
    console.log(animal.zoo);
    res.render("animals/show",{animal:animal});
  });
});

//EDIT
app.get("/animals/:id/edit", function (req,res){
  db.Animal.findById(req.params.id)
    .populate("zoo")
    .exec(function (err,animal){
      res.render("animals/edit", {animal:animal});
    });
});

//UPDATE
app.put("/animals/:id", function (req,res){
  // this can be refactored to key:value refs, calling the req.body.zoos
  db.Animal.findByIdAndUpdate(req.params.id,{
    name:req.body.name, 
    species:req.body.species,
    age:req.body.age,
    photo:req.body.photo,
  }, function (err, animal){
    if(err){
      console.log(err);
      res.render("404");
    }else{
      res.redirect("/zoos");  // after editing, go back to main page
    }
  });
});

//DELETE
app.delete("/zoos/:zoo_id/animals/:id", function (req,res){
  db.Animal.findByIdAndRemove(req.params.id, function (err, zoo){
    if(err){
      console.log(err);
      res.render("404"); //something wrong happens -- 404
    }else{
      res.redirect("/zoos/" + req.params.zoo_id + "/animals");
    }
  });
});

/**
TO DO:

NEED TO ADD ANIMALS TO A ZOO,
currently pulling the id and not strings inside 
of the array

*/




// 404 CATCH ALL
app.get("*", function (req,res){
  res.render("404");
});

// start the server
app.listen(3000, function () {
  console.log("Starting a server on localhost:3000");
  });