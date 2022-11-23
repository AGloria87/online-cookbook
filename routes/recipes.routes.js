const express = require('express');
const router = express.Router();
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");

// Show all recipes
router.get("/all", async (req, res, next) => {
  try {
    const recipesList = await Recipe.find().populate("author");
    res.render("recipes/all-recipes", { recipesList });
  }
  catch (err) {
    console.log(err);
  }
});

// Show recipes by category
router.get("/category/:category", async (req, res, next) => {
  try {
    const { category } = req.params;
    const recipesList = await Recipe.find({ category: category }).populate("author");
    res.render("recipes/all-recipes", { recipesList });
  }
  catch (err) {
    console.log(err);
  }
});

// Routes to create recipes
// GET - show the form to create a recipe
router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("recipes/create-recipe");
});

// POST - Send information to create new recipe
router.post("/create", isLoggedIn, async (req, res, next) => {
  try {
    const { title, category } = req.body;
    const author = req.session.currentUser;
    const ingredients = [];
    const directions = [];

    for (key in req.body) {
      if (key.startsWith("ingr")) {
        ingredients.push(req.body[key]);
      }
      if (key.startsWith("dir")) {
        directions.push(req.body[key]);
      }
    }

    // create new recipe
    const newRecipe = await Recipe.create({
      title,
      category,
      author,
      ingredients,
      directions
    });

    // add new recipe to user's created recipes
    const userRecipes = await User.findByIdAndUpdate(author, {$push: {createdRecipes:newRecipe}}, {new: true});

    res.redirect("/recipes/all");
  }
  catch (err) {
    console.log(err);
  }
});

router.get('/detail/:id', async (req, res, next)=>{
  try {
  const { id } = req.params
  const details = await Recipe.findById(id)
                              .populate('comments')
                              .populate({
                                          path: 'comments',
                                          populate: {
                                            path: 'author',
                                            model: 'User'
                                          }
                                        });
  res.render("detail", details);
 }catch(err){
  console.log(err)
 }

})

module.exports = router;
