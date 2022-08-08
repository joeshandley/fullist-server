const router = require("express").Router();
const path = require("path");
// const utils = require("../utils/utils");

//import data
const carouselsJSONFile = path.join(__dirname, "../data/carousels.json");
const carousels = require(carouselsJSONFile);

//GET request for retrieving new items
router.get("/items", (_req, res) => {
  const items = carousels.find((carousel) => carousel.id === "items");
  res.status(200).json(items.slides);
});

//GET request for retrieving recipes
router.get("/recipes", (_req, res) => {
  const recipes = carousels.find((carousel) => carousel.id === "recipes");
  res.status(200).json(recipes.slides);
});

module.exports = router;
