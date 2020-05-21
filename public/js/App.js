class App extends React.Component {
  state = {
    todos: [],
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    fetch("http://localhost:3000/todos")
      .then((response) => response.json())
      .then((data) => this.setState({ todos: data }));
  };

  handleChange = () => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    fetch("/todos", {
      body: JSON.stringify({ description: this.state.description }),
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((newTodo) => {
        this.setState({
          todos: [newTodo, ...this.state.todos],
          description: "",
        });
      });
  };

  deleteToDo = (id, index) => {
    fetch("todos/" + id, {
      method: "DELETE",
    }).then((data) => {
      this.setState({
        todos: [
          ...this.state.todos.slice(0, index),
          ...this.state.todos.slice(index + 1),
        ],
      });
    });
  };

  render() {
    return (
      <div>
        <h1>React is Running</h1>
        <button onClick={this.getData}>Get Todos</button>

        {/* Add a form to create Todos  */}
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            value={this.state.description}
            id="description"
            onChange={this.handleChange}
          />
          <input type="submit" />
        </form>

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
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector(".root"));
