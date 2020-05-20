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

  render() {
    return (
      <div>
        <h1>React is Running</h1>
        <button onClick={this.getData}>Get Todos</button>

        <ul>
          {this.state.todos.length > 1 &&
            this.state.todos.map((todo) => {
              return <li>{todo.description}</li>;
            })}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector(".root"));
