const express = require('express');
const router = express.Router();
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Recipe = require("../models/Recipe.model");

// Show all recipes
router.get("/all", async (req, res, next) => {
  try {
    const recipesList = await Recipe.find();
    res.render("recipes/all-recipes", { recipesList });
  }
  catch (err) {
    console.log(err);
  }
});

// Routes to create recipes
// GET - show the form to create a recipe
router.get("/create", (req, res, next) => {
  res.render("recipes/create-recipe");
})


module.exports = router;
