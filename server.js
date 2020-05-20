//=============================
//      Dependencies
//=============================
const express = require("express");
const mongoose = require("mongoose");

//=============================
//  Environment Variables
//=============================
const app = express();
const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/merncrud";
const PORT = process.env.PORT || 3000;

//=============================
//  Middleware
//=============================
app.use(express.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings
app.use(express.json()); //use .json(), not .urlencoded()
app.use(express.static("public")); // we need to tell express to use the public directory for static files... this way our app will find index.html as the route of the application! We can then attach React to that file!

//=============================
//  MongoDB Connection
//=============================

mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log("Established Connection with mongo", mongoURI);
});

//======================
//  DB Messaging
//======================

mongoose.connection.on("error", (err) => console.log(err.message));
mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));

//=============================
//  Model
//=============================

const Todos = require("./models/todos");

//==========
// GET
//==========
app.get("/todos", (req, res) => {
  Todos.find({}, (err, foundTodos) => {
    res.json(foundTodos);
  });
});

//==========
// POST
//==========
app.post("/todos", (req, res) => {
  Todos.create(req.body, (err, createdTodo) => {
    res.json(createdTodo); //.json() will send proper headers in response so client knows it's json coming back
  });
});

//=================================================
// Listening on Port 3000 or Default to HEROKU
//=================================================

app.listen(PORT, () => {
  console.log(`Ascoltando al porto... ${PORT}`);
});
