const mongoose = require('mongoose');

const Recipe = require('../models/Recipe.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');

const recipesData = require('../seedData/data.recipes.json');
const commentsData = require('../seedData/data.comments.json');
const usersData = require('../seedData/data.users.json');

// ℹ️ Connects to the database
require("../db");

async function initDB() {
  try {
    await User.collection.drop();
    await Recipe.collection.drop();
    await Comment.collection.drop();

    const staffUser = await User.create(usersData[0]);
    const users = await User.create(usersData.slice(1, usersData.length));
    const newRecipes = await Recipe.create(recipesData);

    // assign staffUser as author of recipes
    await User.findByIdAndUpdate(staffUser._id, { $push : { createdRecipes: newRecipes } }, { new: true });
    await Recipe.updateMany( { newRecipes }, { author: staffUser }, { new: true });

    const recipeComments = [];
    newRecipes.forEach(recipe => {
      const maxComments = recipe.rating.length;

      for (let i = 0; i < maxComments; i++) {
        let commentIndex = Math.floor(Math.random() * commentsData.length);
        let userIndex = Math.floor(Math.random() * users.length);

        const chosenComment = commentsData[commentIndex];
        const chosenUser = users[userIndex];

        recipeComments.push({
          author: chosenUser._id,
          recipe: recipe._id,
          text: chosenComment.text
        });
      }
    });

    await Comment.create(recipeComments);
    console.log("Database seeding complete! Disconnecting now.");

    mongoose.connection.close();
  }

  catch (err) {
    console.log(err);
    mongoose.connection.close();
  }
}

initDB();