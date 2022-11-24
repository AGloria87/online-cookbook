const express = require('express');
const router = express.Router();
const User = require("../models/User.model")

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
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
