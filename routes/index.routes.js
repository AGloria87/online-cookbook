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

    res.render("index", { latestRecipes });
  }
  catch (err) {
    console.log(err)
  }
});

router.get("/userProfile", isLoggedIn, async (req, res, next) => {
  try {
    const { username } = req.session.currentUser;
    const currUser = await User.findOne( {username: username} ).populate("createdRecipes")
                                                               .populate("favoriteRecipes")
    res.render("user/userProfile", currUser);
  }
  catch (err) {
    console.log(err)
  }
});

module.exports = router;