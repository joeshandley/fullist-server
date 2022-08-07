const router = require("express").Router();
const path = require("path");
// const utils = require("../utils/utils");

//import data
const stockJSONFile = path.join(__dirname, "../data/stock.json");
const stock = require(stockJSONFile);

//GET request for checking what is in stock
router.get("/", (req, res) => {
  const inStock = req.body.shops.map((location) => {
    const locationStock = stock.find((shop) => shop.shop === location).stock;
    return req.body.list.every((item) =>
      locationStock.includes(item.toLowerCase())
    );
  });
  res.status(200).json(inStock);
});

module.exports = router;
