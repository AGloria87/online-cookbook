const mongoose = require('mongoose');

const Recipe = require('../models/Recipe.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');

// ℹ️ Connects to the database
require("../db");

// User.collection.drop();
const fakeAuthor = 'masterChef';
const fakeTroll = "randomTroll";
const fakeFan = "cookingFan";

const fakeUsers = [
  {
    username: fakeAuthor,
    email: "master@chef.com",
    password: "master"
  },
  {
    username: fakeTroll,
    email: "random@troll.com",
    password: "troll"
  },
  {
    username: fakeFan,
    email: "cooking@fan.com",
    password: "fan"
  },
]

const fakeTrollComments = [
  {
    text: "This recipe is absolutely terrible."
  }
];

const fakeNiceComments = [
  {
    text: "Thanks for this recipe, it is amazing!"
  }
];

const fakeRecipes = [
  {
    title: 'Ham and Cheese Sandwich',
    category: "lunch",
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
    photo: "https://i.ytimg.com/vi/LW4yk2MWqOw/maxresdefault.jpg",
    rating: [5, 4, 4, 3]
  },
  {
    title: "Omelette du Fromage",
    category: "breakfast",
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
    photo: "https://assets.epicurious.com/photos/54cad8d21f13bb9b2edf9930/master/pass/51262180_cheese-omelette_1x1.jpg",
    rating: [5, 5, 5, 5, 1]
  },
  {
    title: "Strawberries and Cream",
    category: "dessert",
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
    photo: "https://t2.rg.ltmcdn.com/es/posts/0/0/5/fresas_con_crema_24500_orig.jpg",
    rating: [3, 2, 5, 4, 1, 5]
  },
  {
    title: "Aubergine Parmigiana",
    category: "dinner",
    ingredients: [
      "2 aubergines",
      "1/2 onion",
      "4 cloves garlic",
      "olive oil for frying",
      "250g mozarella cheese",
      "3 dried bay leaves",
      "1/2 tbsp dried basil",
      "1/2 tbsp dried oregano",
      "1/2 L tomato puree",
      "salt",
      "pepper"
    ],
    directions: [
      "Preheat oven to 200°C",
      "Next, prepare tomato sauce - finely chop onions and garlic and fry in olive oil for a couple of minutes in a saucepan",
      "Add tomato puree, bay leaves, basil, oregano, salt, and pepper to saucepan and let simmer for a few minutes",
      "While the sauce cooks, cut aubergines and mozarella cheese into thin slices",
      "Once the sauce is cooked and the aubergines and cheese are sliced, arrange them in alternating layers in a baking tray, starting with a thin layer of sauce at the bottom",
      "Put the tray in the oven and bake for 30 minutes"
    ],
    photo: "https://media-cdn.greatbritishchefs.com/media/bbxnwzpc/img25136.whqc_768x512q90.jpg",
    rating: [5, 5, 5, 5, 1, 5, 4, 3, 5, 4, 5]
  }
];

async function initDB() {
  try {
    await User.create(fakeUsers);
    const newRecipes = await Recipe.create(fakeRecipes);
    const newNiceComments = await Comment.create(fakeNiceComments);
    const newTrollComments = await Comment.create(fakeTrollComments);

    // assign author user as author of recipes
    const recipeAuthor = await User.findOne({ username: fakeAuthor});
    await User.findByIdAndUpdate(recipeAuthor._id, { $push : { createdRecipes: newRecipes } }, { new: true });
    await Recipe.updateMany( { newRecipes }, { author: recipeAuthor }, { new: true });

    // asign author to nice comments and assign nice comments to recipes
    const niceAuthor = await User.findOne({ username: fakeFan });
    await Comment.updateMany( { newNiceComments }, { author: niceAuthor }, { new: true });
    await Recipe.updateMany( { newRecipes }, {$push: { comments: newNiceComments } }, { new: true });

    // asign author to troll comments and assign troll comments to recipes
    const trollAuthor = await User.findOne({ username: fakeTroll });
    await Comment.updateMany( { newTrollComments }, { author: trollAuthor }, { new: true });
    await Recipe.updateMany( { newRecipes }, { $push: { comments: newTrollComments } }, { new: true });

    mongoose.connection.close();
  }

  catch (err) {
    console.log(err);
    mongoose.connection.close();
  }
}

initDB();