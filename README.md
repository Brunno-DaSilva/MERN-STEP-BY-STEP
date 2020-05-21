# MERN-STEP-BY-STEP

### Summary

Todo App with MERN stack. Learn MERN by using this step-by-step guide where we will be building a MERN full-stack Todo app with `React CDN` for simplicity, however, you could use this backend as model to any front-end interface, such as Mobile, create-react-app, or other front-end framework, as we will be separating the concerns with our back-end 100% autonomous. This is meant to beginners as an exercise project.

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

#### At this point you should have a fully functional react application with some todos, if you had ran the curl command I mentioned previously.

Now, let's add an update, delete todos route and create todo using our front-end with React.

## Add the Update and Delete Routes

They both will be added to the `controllers/todos.js` file. You will use mongoDB to locate the specific file and update or remove, to update you will do `findByIdAndUpdate()` and `findByIdAndRemove()`

```
//==========
// Delete
//==========
router.delete("/:id", (req, res) => {
  Todos.findByIdAndRemove(req.params.id, (err, deletedTodo) => {
    res.json(deletedTodo);
  });
});

```

Test it wit Curl: `curl -X DELETE http://localhost:3000/todos/58f79d490708714536c02474`

```
//==========
//Update
//==========
router.put("/:id", (req, res) => {
  Todos.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedTodo) => {
      res.json(updatedTodo);
    }
  );
});
```

Test it wit Curl: `curl -X PUT -H "Content-Type: application/json" -d '{"description":"I updated this","complete":true}' http://localhost:3000/todos/58f7a4fd26b1a345e9281cb8`

## Create the create todos form

Since we already created our POST request our backend is ready with our app.post route now we can create a form in react to feed our back-end

#### The form will contain a handleChange and handleSubmit events 

    handleChange(): Will handle the changes in the form, by setting the state to the value typed by the user

    handleSubmit(): Will get the data changed and send it to the backend

```
  handleChange = () => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };
```

```
  handleSubmit = (event) => {
    event.preventDefault();
    fetch("/todos", {
      body: JSON.stringify({ description: this.state.description }),
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((newTodo) => {
        this.setState({
          todos: [newTodo, ...this.state.todos],
          description: "",
        });
      });
  };

```

```
  {/* Add a form to create Todos  */}
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            value={this.state.description}
            id="description"
            onChange={this.handleChange}
          />
          <input type="submit" />
        </form>
```

## Delete Todos

Add a button inside our `map()`and name it delete or something meaningful. Also, add an `onClick()` event to the button. At this point you want to `this.deleteTodo()` that will take two parameters the `todo_id` and `index` of the current value being mapped.

Then, we define the `deleteToDo` method above our `Render()` by fetching the exact route, passing the second argument `method:` as `DELETE` and generating a promise that will update the state of your app by slicing the specific item generating a new array with all the items prior and after our target item.

Add the button in Map

```
<ul>
{this.state.todos.length > 1 &&
  this.state.todos.map((todo, index) => {
    return (
      <li>
        {todo.description}
        <button onClick={() => this.deleteToDo(todo._id, index)}>
          Delete
        </button>
      </li>
    );
  })}
</ul>

```

```
  deleteToDo = (id, index) => {
    fetch("todos/" + id, {
      method: "DELETE",
    }).then((data) => {
      this.setState({
        todos: [
          ...this.state.todos.slice(0, index),
          ...this.state.todos.slice(index + 1),
        ],
      });
    });
  };

```
