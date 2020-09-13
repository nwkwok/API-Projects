//These are my own notes included below on making a RESTful API



//To make a RESTful API, here are the steps

// 1. Use your boiler plate to setup your app.js with
// mongoose, body.parser, express and ejs.
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const lodash = require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//2. Create and connect your database to mongoDB
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//3. Create your schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

//3. Create your new object model
const Article = mongoose.model("Article", articleSchema);


//7. Refactor code by using the app.route() method
app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article!");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        console.log("Successfully deleted all articles");
      } else {
        console.log(err);
      }
    });
  });

//8. Get the document on a specific collection

app.route("/articles/:articleTitle").get(function(req, res) {

    Article.find({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send(err);
      }
    });
  })

  //9. Setup 'PUT' to be able to update the specific document form the specific collection.
  //If you only have the content and no title in your put request, the new article will not have a title and will erase the previous article all together.

  .put(function(req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
      function(err) {
        if (!err) {
          res.send("Your article has been updated");
        }
      })
  })

  //10. Add a patch request that will patch a particular field in a specific document inside of a collection

  .patch(function(req, res) {
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err) {
        if (!err) {
          res.send("Successfully sent article");
        } else {
          res.send("Could not send article");
        }
      }
    );
  })


//11. Add a delete request that will delete on specific document inside of a collection

  .delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle},
    function(err){
      if (!err) {
        res.send("Article successfully deleted");
      } else {
        res.send("Could not delete this article.");
      }
    })
  });


/*
//4. Create GET request that fetches ALL documents from your collection
//In this instance the collection route is "/articles"
app.get("/articles", function(req, res){
  Article.find(function(err, foundArticles){
    if (!err){
    res.send(foundArticles);
  } else {
    res.send(err);
  }
  });
});

//5. Create a POST request that posts ONE new document to your collection
//In this instance it's a document to article collection
app.post("/articles", function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if (!err) {
      res.send("Successfully added a new article!");
    } else {
      res.send(err);
    }
  });
});

//6. Create a DELETE request that can delete ALL items from a collection
app.delete("/articles", function(req, res){
  Article.deleteMany(function(err){
    if (!err) {
      console.log("Successfully deleted all articles");
    } else {
      console.log(err);
    }
  });
});

*/


app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
