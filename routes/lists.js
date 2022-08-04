const router = require("express").Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const id = uuidv4();
const utils = require("../utils/utils");

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

// //POST request for new list
// router.post("/", (req, res) => {
//   if (!req.body.name) {
//     return res.status(400).json({
//       errorMessage: "Please provide item name",
//     });
//   }

//   const newItem = {
//     id: id,
//     name: req.body.name,
//     quantity: req.body.quantity,
//   };

//   utils.writeToJsonFile(listsJSONFile, [...lists, newItem]);
//   res.status(201).json({ newlistCreated: newItem, success: true });
// });

//POST request for new list item
router.post("/:id/add-item", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({
      errorMessage: "Please provide item name",
    });
  }

  const thisList = lists.find((list) => list.id === req.params.id);
  if (!thisList) {
    return res.status(404).json({
      errorMessage: `List with id ${req.params.id} cannot be found`,
    });
  }

  const newItem = {
    id: id,
    name: req.body.name,
    quantity: req.body.quantity,
  };
  thisList.items.push(newItem);

  const updatedLists = lists.map((list) =>
    list.id === req.params.id ? thisList : list
  );

  utils.writeToJsonFile(listsJSONFile, updatedLists);
  res.status(201).json({ itemAdded: newItem, success: true });
});

//DELETE request to remove item from list
router.delete("/:listId/:itemId", (req, res) => {
  const newList = lists.find((list) => list.id === req.params.listId);
  if (!newList) {
    return res.status(404).json({
      errorMessage: `List with id ${req.params.listId} cannot be found`,
    });
  }

  const item = newList.items.find((item) => item.id === req.params.itemId);
  if (!item) {
    return res.status(404).json({
      errorMessage: `Item with id ${req.params.itemId} cannot be found`,
    });
  }

  newList.items = newList.items.filter((item) => item.id !== req.params.itemId);

  const updatedLists = lists.map((list) =>
    list.id === req.params.id ? newList : list
  );

  utils.writeToJsonFile(listsJSONFile, updatedLists);
  res
    .status(200)
    .json({ deleteMessage: `Item with id ${req.params.itemId} was deleted` });
});

module.exports = router;
