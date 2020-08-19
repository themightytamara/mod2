
import React from "react";
import Book from "./Book";
import FavoriteItem from "./FavoriteItem";
import "./../styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      results: [],
      status: "",
      favorites: [],
      isLoading: false
    };
    this.handleApiRequest = this.handleApiRequest.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
  }

  handleApiRequest(event) {
    event.preventDefault();
    this.setState({ status: "", isLoading: true });

    const key = process.env.REACT_APP_CLIENT_ID;

    const searchTitle = this.state.search;
    fetch(`http://www.penguinrandomhouse.biz/webservices/rest/titles` + searchTitle)
      .then(data => data.json())
      .then(data =>
        this.setState({
          results: data,
          status: data.response,
          isLoading: false
        })
      );
  }

  handleFavoriteClick(x) {
    this.setState({
      favorites: [...this.state.favorites, x]
    });
  }

  handleChange(e) {
    this.setState({ search: e.target.value });
  }

  render() {
    let loading;
    if (this.state.isLoading) {
      loading = (
        "loading"
      );
    } else {
      loading = "";
    }

    const response = this.state.status;
    let titleResults = "";
    let booksResults;
    if (response === "success") {
      booksResults = this.state.results.results.map(item => (
        <Book
          key={item.id}
          data={item}
          onHandleChange={this.handleFavoriteClick}
        />
      ));
      titleResults = (
        <h4 className="title is-5 resultLine">
          Showing Results for {this.state.search}
        </h4>
      );
    } else if (response === "error") {
      booksResults = (
        <div className="no-results">
          <p className="subtitle noRes">😕 Sorry...</p>
          <p className="title noRes">No results.</p>
        </div>
      );
      titleResults = "";
    } else {
      booksResults = "";
      titleResults = "";
    }

    const namesFavorites = this.state.favorites.map(item => (
      <FavoriteItem name={item} />
    ));

    return (
      <div className="App">
        <div className="favoritesLeft">
          <h4 className="title is-5 favTitle">My Favorites</h4>
          <h4 className="title is-5">
            Books{" "}
            <span className="tag is-warning">
              {this.state.favorites.length}
            </span>{" "}
          </h4>
          {namesFavorites}
        </div>
        <div className="center">
          <div className="serachTop">
            <div>
              <h1 className="title">Books App</h1>
              <form onSubmit={this.handleApiRequest}>
                <label className="subtitle">
                  Type a book's title:
                  <br />
                  <input
                    className="input is-small"
                    type="text"
                    value={this.state.search}
                    onChange={this.handleChange}
                  />
                </label>
                <br />
                <button className="button is-primary">Search</button>
              </form>
              <div>{titleResults}</div>
            </div>
          </div>
          <div className="resultsCenter">
            {booksResults}
            {loading}
          </div>
          <footer>
          </footer>
        </div>
      </div>
    );
  }
}

export default App;
