const router = require("express").Router();
const path = require("path");

//import data
const listsJSONFile = path.join(__dirname, "../data/lists.json");
const lists = require(listsJSONFile);

//GET request for all lists
router.get("/", (_req, res) => {
  res.status(200).json(lists);
});

//GET request for one list
router.get("/:id", (req, res) => {
  const list = lists.find((list) => list.id === req.params.id);
  if (!list) {
    res.status(404).json({
      error: `List with id ${req.params.id} cannot be found`,
    });
  }
  res.status(200).json(list);
});

module.exports = router;
