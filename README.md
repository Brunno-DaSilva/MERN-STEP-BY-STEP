# MERN-STEP-BY-STEP

`mkdir mern-app`
`cd mern-app`

`touch server.js`
`npm init -y`
`npm install express mongoose --save`

## Required express and mongoose

```
//=============================
//      Dependencies
//=============================
const express = require("express");
const mongoose = require("mongoose");
```

## Add environment variables and set the App to Heroku deployment

```
//=============================
//  Environment Variable
//=============================
const app = express();
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/merncrud";
const PORT = process.env.PORT || 8083;
```

## Make the connection with MongoDB

Set the the mongoURI pass the mongodb parser and if the connection is successful log a message.

```
//=============================
//  MongoDB Connection
//=============================
mongoose.connect(mongoURI, { useNewUrlParser: true }, () => {
  console.log("Established Connection with mongo", mongoURI);
});
```

## Handle connection error message and mongo disconnected

```
//======================
//  DB Messaging
//======================
mongoose.connection.on("error", (err) => console.log(err.message));
mongoose.connection.on("disconnected", () => console.log("mongo disconnected"));
```

## Set the variable app to listen to the appropriate port on your local machine it will run on 3000 or it will default to HEROKU

```
//=================================================
// Listening on Port 3000 or Default to HEROKU
//=================================================
app.listen(PORT, () => {
  console.log(`Ascoltando al porto... ${PORT}`);
});
```

## Create a models folder and add a todos.js file and a todoSchema

`mkdir models`

`cd models touch todos.js`

```
//=============================
// Dependencies
//=============================

const mongoose = require("mongoose");

//=============================
//      Users Schema
//=============================
const todoSchema = new mongoose.Schema({
  description: String,
  complete: Boolean,
});

//=============================
// Todos Models
//=============================

const Todos = mongoose.model("Todo", todoSchema);

//=============================
// Export Todos Models
//=============================
module.exports = Todos;

```
