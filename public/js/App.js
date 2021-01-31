const ToDoItem = (props) => {
  return (
    <tr className={props.todo.complete ? "complete" : ""}>
      <td className="todoItem">
        <p className="todo-description">{props.todo.description}</p>
      </td>
      <td className="align-td-center">
        <button
          className="table__btn-checked"
          onClick={() => props.updateToDo(props.todo)}
        >
          {props.todo.complete ? (
            <i className="fas fa-check fa-2x complete "></i>
          ) : (
            <i className="fas fa-circle fa-2x gray"></i>
          )}
        </button>
      </td>
      <td className="align-td-center">
        <button
          className="table__btn-delete"
          onClick={() => props.deleteTodo(props.todo._id, props.index)}
        >
          <i className="fas fa-trash fa-2x"></i>
        </button>
      </td>
    </tr>
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

  updateToDo = (todo) => {
    todo.complete = !todo.complete;

    fetch(`todos/${todo._id}`, {
      body: JSON.stringify(todo),
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.getData();
      });
  };

  render() {
    return (
      <div className="wrapper">
        <div className="sidebar">
          <label id="hamburger" for="toggle">
            &#9776;
          </label>
          <input type="checkbox" id="toggle" />

          <div className="logo">
            <img
              src="https://res.cloudinary.com/duprwuo4j/image/upload/v1574831158/Logo/BLOGO_k36v5y.png"
              alt="logo"
            />
          </div>
          <ul class="hide-menu">
            <li>
              <a href="#">
                <i className="fas fa-home"></i>
              </a>
            </li>
            <li>
              <button className="sidebar-button" onClick={this.getData}>
                <a
                  href="https://www.linkedin.com/in/bruno-dasilva/"
                  target="_blank"
                  title="Bruno DaSilva LinkedIn"
                >
                  <i className="fas fa-plus"></i>
                </a>
              </button>
            </li>
            <li>
              <a
                href="https://github.com/Brunno-DaSilva"
                target="_blank"
                title="Bruno DaSilva GitHub"
              >
                <i className="fas fa-users"></i>
              </a>
            </li>
            <li title="Access my Portfolio">
              <a
                href="http://www.bruno-dasilva.com/"
                target="_blank"
                title="Bruno DaSilva Portfolio"
              >
                <i className="fas fa-cookie-bite"></i>
              </a>
            </li>
          </ul>
        </div>

        <div class="main_content">
          <div className="main-app-title">
            <h1>MERN Todo App</h1>
          </div>
          <form id="add-todo" onSubmit={this.handleSubmit}>
            <label htmlFor="description">Description</label>

            <input
              type="text"
              value={this.state.description}
              id="description"
              onChange={this.handleChange}
            />

            <input type="submit" />
          </form>

          <table id="table-sm">
            <tr>
              <th className="table-title">
                <i className="fas fa-clipboard-list"> </i> Task Name
              </th>
              <th className="table-title">
                <i className="fas fa-calendar-check"></i>{" "}
                <i className="fas fa-trash"></i> <span>Action</span>
              </th>
            </tr>

            {this.state.todos.length > 0 &&
              this.state.todos.map((todo, index) => {
                return (
                  <ToDoItem
                    todo={todo}
                    index={index}
                    deleteTodo={this.deleteTodo}
                    updateToDo={this.updateToDo}
                  />
                );
              })}
          </table>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector(".root"));
