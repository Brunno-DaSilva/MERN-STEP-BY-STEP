//=============================
// Dependencies
//=============================

const express = require("express");
const router = express.Router();

//=============================
//  Model
//=============================

const Todos = require("../models/todos");

//==========
// GET
//==========
router.get("/", (req, res) => {
  Todos.find({}, (err, foundTodos) => {
    res.json(foundTodos);
  });
});

//==========
// POST
//==========
router.post("/", (req, res) => {
  Todos.create(req.body, (err, createdTodo) => {
    res.json(createdTodo); //.json() will send proper headers in response so client knows it's json coming back
  });
});

//==========
// Delete
//==========
router.delete("/:id", (req, res) => {
  Todos.findByIdAndRemove(req.params.id, (err, deletedTodo) => {
    res.json(deletedTodo);
  });
});

//==========
// Update
//==========

router.put("/:id", (req, res) => {
  Todos.findByIdAndUpdate(req.params.id, req.body, (err, updatedTodo) => {
    res.json(updatedTodo);
  });
});

module.exports = router;
