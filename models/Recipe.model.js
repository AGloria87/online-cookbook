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
      enum: ["breakfast", "lunch", "dinner", "dessert", "other"]
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
      type: String,
      default: "https://res.cloudinary.com/dwhznw5ny/image/upload/v1674068428/online-cookbook/recipeDefault_j3nkbo.png"
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
