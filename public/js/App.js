const ToDoItem = (props) => {
  return (
    <li>
      {props.todo.description}
      <button onClick={() => props.deleteTodo(props.todo._id, props.index)}>
        Delete
      </button>
    </li>
  );
};

class App extends React.Component {
  state = {
    todos: [],
    description: "",
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    fetch("/todos")
      .then((response) => response.json())
      .then((data) => this.setState({ todos: data }));
  };

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
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

  deleteTodo = (id, index) => {
    fetch(`/todos/${id}`, {
      method: "DELETE",
    }).then((response) => {
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
        <h1>My To Do List</h1>
        <button onClick={this.getData}>Get Todos</button>
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
          {this.state.todos.length > 0 &&
            this.state.todos.map((todo, index) => {
              return (
                <ToDoItem
                  todo={todo}
                  index={index}
                  deleteTodo={this.deleteTodo}
                />
              );
            })}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector(".root"));
