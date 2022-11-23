const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId, ref: 'User',
    },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Dessert", "Other"]
    },
    ingredients: {
      type: [String],
      required: true,
      trim: true,
    },
    directions: {
      type: [String],
      required: true,
      trim: true
    },
    photo: {
      type: String
    },
    rating: [Number],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  },
  {
    timestamps: true,
  }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;
