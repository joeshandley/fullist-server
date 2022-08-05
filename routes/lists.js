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

//GET request for favourite lists
router.get("/favourites", (_req, res) => {
  const favourites = lists.filter((list) => list.favourite);
  res.status(200).json(favourites);
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

//POST request for new list
router.post("/", (_req, res) => {
  const newList = {
    id: id,
    name: "",
    favourite: false,
    items: [],
  };

  utils.writeToJsonFile(listsJSONFile, [...lists, newList]);
  res.status(201).json({ newListCreated: newList, success: true });
});

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

//DELETE request to remove single list
router.delete("/:listId", (req, res) => {
  const deleteList = lists.some((list) => list.id === req.params.listId);
  if (!deleteList) {
    return res.status(404).json({
      errorMessage: `List with id ${req.params.listId} cannot be found`,
    });
  }

  const updatedLists = lists.filter((list) => list.id !== req.params.listId);

  utils.writeToJsonFile(listsJSONFile, updatedLists);
  res
    .status(200)
    .json({ deleteMessage: `List with id ${req.params.listId} was deleted` });
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
    list.id === req.params.listId ? newList : list
  );

  utils.writeToJsonFile(listsJSONFile, updatedLists);
  res
    .status(200)
    .json({ deleteMessage: `Item with id ${req.params.itemId} was deleted` });
});

//PATCH request for changing the list name
router.patch("/:id", (req, res) => {
  const patchedList = lists.find((list) => list.id === req.params.id);
  if (!patchedList) {
    return res.status(404).json({
      errorMessage: `List with id ${req.params.id} cannot be found`,
    });
  }

  if (!req.body.name) {
    return res.status(400).json({
      errorMessage: "List name cannot be blank. Please enter a list name",
    });
  }

  patchedList.name = req.body.name;

  const updatedLists = lists.map((list) =>
    list.id === req.params.id ? patchedList : list
  );

  utils.writeToJsonFile(listsJSONFile, updatedLists);
  res.status(200).json({
    patchMessage: `List was renamed to ${req.body.name}`,
    success: true,
  });
});

//PATCH request for toggling list favourites
router.patch("/:listId/favourite", (req, res) => {
  const favouritedList = lists.find((list) => list.id === req.params.listId);
  if (!favouritedList) {
    return res.status(404).json({
      errorMessage: `List with id ${req.params.listId} cannot be found`,
    });
  }

  favouritedList.favourite
    ? (favouritedList.favourite = false)
    : (favouritedList.favourite = true);

  const updatedLists = lists.map((list) =>
    list.id === req.params.listId ? favouritedList : list
  );

  utils.writeToJsonFile(listsJSONFile, updatedLists);
  res.status(200).json({ listFavourited: favouritedList.favourite });
});

//PATCH request for editing list item
router.patch("/:listId/:itemId", (req, res) => {
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

  const newItem = { ...item, ...req.body };

  newList.items = newList.items.map((item) =>
    item.id === req.params.itemId ? newItem : item
  );

  const updatedLists = lists.map((list) =>
    list.id === req.params.listId ? newList : list
  );

  utils.writeToJsonFile(listsJSONFile, updatedLists);
  res.status(200).json({ updatedItem: newItem });
});

module.exports = router;
