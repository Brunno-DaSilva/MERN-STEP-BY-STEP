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

//=================================================
// Listening on Port 3000 or Default to HEROKU
//=================================================

app.listen(PORT, () => {
  console.log(`Ascoltando al porto... ${PORT}`);
});
