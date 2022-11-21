const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId, ref: 'User'
    },
    ingredients: {
      type: [{type: Schema.Types.ObjectId, ref: 'Ingredient'}],
      required: true,
      unique: true,
      trim: true,
    },
    directions: {
      type: [String],
      required: true,
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
