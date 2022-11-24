const express = require('express');
const router = express.Router();
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const fileUploader = require('../config/cloudinary.config');
const session = require('express-session');

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
router.post("/create", isLoggedIn, fileUploader.single("Recipe-image"), async (req, res, next) => {
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
      directions,
      photo : req.file.path 
    });
    console.log(newRecipe)

    // add new recipe to user's created recipes
    const userRecipes = await User.findByIdAndUpdate(author, {$push: {createdRecipes:newRecipe}}, {new: true});

    res.redirect("/userProfile");
  }
  catch (err) {
    console.log(err);
  }
});

router.get('/:id/detail', async (req, res, next)=>{
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
                                        })
                              .populate("author");
  res.render("recipes/detail", details,);
 }catch(err){
  console.log(err)
 }
});

// Edit recipe routes
//GET - show the form with previous recipe info
router.get("/:id/edit", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id)
    res.render("recipes/edit-recipe", recipe);
  }
  catch (err) {
    console.log(err);
  }
});

// POST - Send information to update recipe
router.post("/:id/edit", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category } = req.body;
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

    // Update recipe with new data
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
      title: title,
      category: category,
      ingredients: ingredients,
      directions: directions
    }, {new: true});

    res.redirect(`/recipes/${id}/detail`);
  }
  catch (err) {
    console.log(err);
  }
});

// Delete recipe
router.post("/:id/delete", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    res.redirect("/userProfile");
  }
  catch (err) {
    console.log(err);
  }
})

router.get('/:id/detail', async (req, res, next)=>{
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
                                        })
                              .populate("author");
  res.render("recipes/detail", details);
 }catch(err){
  console.log(err)
 }
});

// Add Recipe Feedback
router.post("/:id/feedback", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, commentText } = req.body;

    console.log(rating);
    console.log(commentText);

    const addRating = await Recipe.findByIdAndUpdate(id, { $push: { rating: rating } }, { new: true });

    if (commentText) {
      const newComment = await Comment.create({
        author: req.session.currentUser,
        text: commentText
      });

      const addComment = await Recipe.findByIdAndUpdate(id, {$push: { comments: newComment }}, { new: true });
    }

    res.redirect(`/recipes/${id}/detail`);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;
