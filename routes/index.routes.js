const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const Recipe = require("../models/Recipe.model")

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    const latestRecipes = await Recipe
      .find()
      .sort({"createdAt": -1})
      .limit(4)
      .populate("author")

    res.render("index", { latestRecipes });
  }
  catch (err) {
    next(err)
  }
});

router.get("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const userData = await User
      .findOne( {username: username} )
      .populate("createdRecipes")
      .populate({
        path: 'createdRecipes',
        populate: {
          path: 'author',
          model: 'User'
          }
        })
      .populate("favoriteRecipes")
      .populate({
      path: 'favoriteRecipes',
      populate: {
        path: 'author',
        model: 'User'
        }
      })

    if (!userData) {
      res.status(404).render("not-found");
    }
    else {
      res.render("userProfile", userData);
    }
  }
  catch (err) {
    next(err)
  }
});

module.exports = router;