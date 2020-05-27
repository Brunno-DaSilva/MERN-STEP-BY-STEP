const ToDoItem = (props) => {
  return (
    // <li>
    //   <div className={props.todo.complete ? "complete" : ""}>
    //     {props.todo.description}
    //   </div>
    //   <button onClick={() => props.deleteTodo(props.todo._id, props.index)}>
    //     Delete
    //   </button>
    //   <button onClick={() => props.updateToDo(props.todo)}>Complete</button>
    // </li>
    <tr className={props.todo.complete ? "complete" : ""}>
      <td className="todoItem">{props.todo.description}</td>
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
          <div className="logo">
            <img
              src="https://res.cloudinary.com/duprwuo4j/image/upload/v1574831158/imgs_starwars/imgs/BLOGO_k36v5y.png"
              alt="logo"
            />
          </div>
          <ul>
            <li>
              <a href="#">
                <i className="fas fa-home"></i>
              </a>
            </li>
            <li>
              <button className="sidebar-button" onClick={this.getData}>
                <a href="#">
                  <i className="fas fa-plus"></i>
                </a>
              </button>
            </li>
            <li>
              <a href="#">
                <i className="fas fa-users"></i>
              </a>
            </li>
            <li>
              <a href="http://www.bruno-dasilva.com/">
                <i className="fas fa-cookie-bite"></i>
              </a>
            </li>
          </ul>
        </div>

        <div class="main_content">
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
                <i className="fas fa-trash"></i> Action
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

          {/* <ul>
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
          </ul> */}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector(".root"));
