const mongoose = require('mongoose');

const Recipe = require('../models/Recipe.model');

// ℹ️ Connects to the database
require("../db");

// User.collection.drop();

const fakeRecipes = [
  {
    title: 'Ham and Cheese Sandwich',
    category: "Lunch",
    ingredients: [
      "2 slices of bread",
      "2 slices of ham",
      "2 slices of cheese",
      "mayonnaise",
      "mustard"
    ],
    directions: [
      "Spread mayonnaise on one slice of bread and mustard on the other.",
      "Place the slices of bread on a dish with condiment facing up.",
      "On one slice of bread place the slices of ham and cheese alternating them.",
      "Place the remaining slice of bread on top of the one with the ham and cheese"
    ],
    photo: "https://i.ytimg.com/vi/LW4yk2MWqOw/maxresdefault.jpg"
  },
  {
    title: "Omelette du Fromage",
    category: "Breakfast",
    ingredients: [
      "2 eggs",
      "1/2 onion",
      "1/2 cup grated cheese",
      "salt",
      "pepper"
    ],
    directions: [
      "Scramble the eggs in a bowl.",
      "Fry the onion in a frying pan for about 5 minutes, then set aside.",
      "In the same frying pan, pour the egg and let cook for about 1-2 minutes",
      "Add the cooked onion and the grated cheese onto the egg and let cook for another 2 minutes",
      "Fold the omelette in half and let it sit for 1 minute, then turn it onto the other side.",
      "Let it cook for 1 more minute, and then serve."
    ],
    photo: "https://assets.epicurious.com/photos/54cad8d21f13bb9b2edf9930/master/pass/51262180_cheese-omelette_1x1.jpg"
  },
  {
    title: "Strawberries and Cream",
    category: "Dessert",
    ingredients: [
      "200g strawberries",
      "1/2 can condensed milk",
      "1/2 bottle light cream",
      "sprinke of sugar"
    ],
    directions: [
      "Cut the strawberries in thin slices and sprinkle some sugar on them",
      "Mix the condensed milk and cream in a bowl.",
      "Add the strawberries to the cream and mix them in."
    ],
    photo: "https://t2.rg.ltmcdn.com/es/posts/0/0/5/fresas_con_crema_24500_orig.jpg"
  }
];

Recipe.create(fakeRecipes)
  .then(dbRecipes => {
    console.log(`Created ${dbRecipes.length} recipes`);
    mongoose.connection.close();
  })
  .catch(err => console.log(`An error occurred while creating fake recipes in the DB: ${err}`));
