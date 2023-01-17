const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const Recipe = require("../models/Recipe.model")

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    const latestRecipes = await Recipe.find()
                                      .sort({"createdAt": -1})
                                      .limit(5)
                                      .populate("author")

    res.render("index", { latestRecipes });
  }
  catch (err) {
    console.log(err)
  }
});

router.get("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    console.log(req.params)
    const userData = await User.findOne( {username: username} ).populate("createdRecipes")
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

    res.render("user/userProfile", userData);
  }
  catch (err) {
    console.log(err)
  }
});

module.exports = router;