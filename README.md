# MERN-STEP-BY-STEP

Todo App with Merd

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

## Add a Middleware and fix the Model : The Middleware needs to be place at the top of the server.js bellow the environment variables

```
//=============================
//  Middleware
//=============================
app.use(express.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings
app.use(express.json()); //use .json(), not .urlencoded()
app.use(express.static("public")); // we need to tell express to use the public directory for static files... this way our app will find index.html as the route of the application! We can then attach React to that file!
```

##### …

```
//=============================
//  Model
//=============================
const Todos = require("./models/todos.js");
app.get("/todos", (req, res) => {
  Todos.find({}, (err, foundTodos) => {
    res.json(foundTodos);
  });
});
```

## Create the post rout

```
//==========
// POST
//==========
app.post("/todos", (req, res) => {
  Todos.create(req.body, (err, createdTodo) => {
    res.json(createdTodo); //.json() will send proper headers in response so client knows it's json coming back
  });
});

```

## Create the Controllers

`mkdir controllers`
`touch controllers/todos.js`

### Move Models, get, and post to the controllers file

```
//=============================
// Dependencies
//=============================
const express = require("express");
const router = express.Router();
//=============================
//  Model
//=============================
const Todos = require("../models/todos");
//==========
// GET
//==========
router.get("/", (req, res) => {
  Todos.find({}, (err, foundTodos) => {
    res.json(foundTodos);
  });
});
//==========
// POST
//==========
router.post("/", (req, res) => {
  Todos.create(req.body, (err, createdTodo) => {
    res.json(createdTodo); //.json() will send proper headers in response so client knows it's json coming back
  });
});
module.exports = router;
```

Use Curl to test it out:

`nodemon`

`curl -X POST -H "Content-Type: application/json" -d '{"description":"weee","complete":true}'`

### To complete the controllers, connect it to the server

```
//=============================
//  Routers
//=============================
const todosController = require("./controllers/todos");
app.use("/todos", todosController);
```

## Create a Public folder and create style.css and index.html and add react CDN to the index

```
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <title>React State Store</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.3.2/umd/react.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.3.2/umd/react-dom.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js"></script>
    <script type="text/babel" src="./js/app.js"></script>
  </head>
  <body>
    <div class="root">
      <!-- React will load our App here -->
    </div>
  </body>
</html>
```

## Make App.js React your Main React Component

```
class App extends React.Component {
   render() {
    return (
      <div>
        <h1>React is Running</h1>
        <button>Get Todos</button>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.querySelector(".root"));

```

## Set state and fetch the data from your localhost in my case 3000

```
state = {
    todos: [],
  };


  getData = () => {
    fetch("http://localhost:3000/todos")
      .then((response) => response.json())
      .then((data) => this.setState({ todos: data }));
  };
```

## Pass the getData Method onClick and map over the current todos if any

Use curl:

`curl -X POST -H "Content-Type: application/json" -d '{"description":"Code Master","complete":true}'`

```
<button onClick={this.getData}>Get Todos</button>
        <ul>
          {this.state.todos.length > 0 &&
            this.state.todos.map((todo) => {
              return <li>{todo.description}</li>;
            })}
        </ul>
```

## Add the componentDidMount() between state and getData(), pass the

```
 componentDidMount() {
    this.getData();
  }
```

#### At this point you should have a fully functional react application with some todos, if you have ran the curl command I mentioned previously.

Now, let's add a create and delete todos rout and the front-end with React.
