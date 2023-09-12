const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model");
const fileUploader = require('../config/cloudinary.config');
const capitalize = require('../utils/capitalize');

// Show recipes by category
router.get("/category/:category", async (req, res, next) => {
  try {
    const { category } = req.params;
    let recipesList;

    if (category === "all") {
      recipesList = await Recipe.find().populate("author", "username");
    }
    else {
      recipesList = await Recipe.find({ category: category }).populate("author", "username");
    }
    const data = { recipesList, category: `${capitalize(category)}` };
    res.render("recipes/all-recipes", data);
  }
  catch (err) {
    next(err);
  }
});

// Routes to create recipes
// GET - show the form to create a recipe
router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("recipes/create-recipe");
});

// POST - Send information to create new recipe
router.post("/create", isLoggedIn, fileUploader.single("recipe-image"), async (req, res, next) => {
  try {
    const { title, category } = req.body;
    const author = req.session.currentUser;
    const fileAdded = req.hasOwnProperty("file");
    const ingredients = [];
    const directions = [];

    if (!title) {
      res.status(400).render("recipes/create-recipe", {
        errorMessage: "Please add a title."
      });
      return;
    }

    if (!category) {
      res.status(400).render("recipes/create-recipe", {
        errorMessage: "Please choose a category."
      });
      return;
    }

    for (key in req.body) {
      if (!req.body[key]) {
        res.status(400).render("recipes/create-recipe", {
          errorMessage: "Please fill or delete empty ingredient or direction fields."
        });
        return;
      }

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
      ...(fileAdded && { photo: req.file.path })
    });

    // add new recipe to user's created recipes
    await User.findByIdAndUpdate(author, { $push: { createdRecipes:newRecipe }}, { new: true });
    res.redirect(`/recipes/${newRecipe._id}`);
  }

  catch (err) {
    next(err);
  }
});

router.get('/:recipeId', async (req, res, next)=>{
  try {
    const { recipeId } = req.params
    const details = await Recipe.findById(recipeId).populate("author");
    const comments = await Comment.find({ recipe: recipeId }).populate('author', 'username');
    res.render("recipes/detail", { details, comments });
  }
  catch(err){
    next(err)
  }
});

// Edit recipe routes
//GET - show the form with previous recipe info
router.get("/:recipeId/edit", isLoggedIn, async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { error } = req.session;
    const recipe = await Recipe.findById(recipeId);

    res.render("recipes/edit-recipe", {
      recipe, ...(error && { errorMessage: error })
    });

    delete req.session.error;
  }

  catch (err) {
    next(err);
  }
});

// POST - Send information to update recipe
router.post("/:recipeId/edit", isLoggedIn, fileUploader.single("recipe-image"), async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { title, category } = req.body;
    const fileAdded = req.hasOwnProperty("file");
    const ingredients = [];
    const directions = [];

    if (!title) {
      req.session.error = "Please add a title.";
      res.status(400).redirect(`/recipes/${recipeId}/edit`);
      return;
    }

    for (key in req.body) {
      if (!req.body[key]) {
        req.session.error = "Please fill or delete empty ingredient or direction fields.";
        res.status(400).redirect(`/recipes/${recipeId}/edit`);
        return;
      }

      if (key.startsWith("ingr")) {
        ingredients.push(req.body[key]);
      }

      if (key.startsWith("dir")) {
        directions.push(req.body[key]);
      }
    }

    // Update recipe with new data
    await Recipe.findByIdAndUpdate(recipeId, {
      title: title,
      category: category,
      ingredients: ingredients,
      directions: directions,
      ...(fileAdded && { photo: req.file.path })
    }, { new: true }
    );

    res.redirect(`/recipes/${recipeId}`);
  }

  catch (err) {
    next(err);
  }
});

// Delete recipe
router.post("/:recipeId/delete", isLoggedIn, async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const author = req.session.currentUser;
    await Recipe.findByIdAndDelete(recipeId);
    res.redirect(`/${author.username}`);
  }
  catch (err) {
    next(err);
  }
})

// Add Recipe Feedback
router.post("/:recipeId/feedback", isLoggedIn, async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { rating, commentText } = req.body;

    await Recipe.findByIdAndUpdate(recipeId, { $push: { rating: rating } }, { new: true });

    if (commentText) {
      const newComment = await Comment.create({
        author: req.session.currentUser,
        recipe: recipeId,
        text: commentText
      });

      await Recipe.findByIdAndUpdate(recipeId, { $push: { comments: newComment } }, { new: true });
    }

    res.redirect(`/recipes/${recipeId}`);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports = router;
