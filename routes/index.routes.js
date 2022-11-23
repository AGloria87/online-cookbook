const express = require('express');
const router = express.Router();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/userProfile", isLoggedIn, (req, res, next) => {
  res.render("user/userProfile");
});

module.exports = router;
