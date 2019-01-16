import React, { Component } from "react";
import showAPI from "../../utils/showAPI";
import mediaAPI from "../../utils/mediaAPI";
import userAPI from "../../utils/userAPI";
import SearchForm from "../SearchForm";
import Sidebar from "../Sidebar";
import Results from "../Results";
import "./mediaPages.scss";

class Shows extends Component {
  state = {
    search: "",
    saved: [],
    results: [],
    postText: ""
  }

  handleInputChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  };

  handleSearch = event => {
    event.preventDefault();
    this.searchShows(this.state.search)
  }

  searchShows = query => {
    const results = [];
    showAPI.search(query)
      .then(function(res) {
        console.log(res.data)
        res.data.forEach(show => {
          results.push(
            {
              type: "show",
              title: show.title ? show.title : "",
              year: show.year ? show.year : "",
              image: show.poster && show.poster !== "N/A" ? show.poster : show.poster === "N/A" ? "http://placehold.it/128x170" : "http://placehold.it/128x170",
              description: show.summary ? show.summary : "No plot summary available",
              link: show.link ? show.link : "",
              creator: show.writer && show.writer !== "N/A" ? show.writer : show.writer === "N/A" ? "" : "",
              genre: show.genre ? show.genre : "",
              rating: show.rating ? show.rating : "",
              apiId: show.apiId
            }
          )
        });
      })
      .then(() => this.setState({ results }))
      .catch(err => console.log(err));
  };

  clearResults = () => {
    this.setState({results: []})
  }

  componentDidMount() {
    this.getShows();
  }

  handleSave = id => {
    const show = this.state.results.find(show => show.apiId === id);
    this.setState({ search: "", results : [] })
    mediaAPI.create({
      type: "show",
      title: show.title,
      year: show.year,
      image: show.image,
      description: show.description,
      link: show.link,
      creator: show.creator,
      genre: show.genre,
      rating: show.rating,
      apiId: show.apiId
    }).then(() => {
      //Once the show is saved, reset state for results
      this.setState({ results : [] })
      this.getShows()
    })
  }

  getShows = () => {
    userAPI.getUserMedia()
    .then((res) => {
      this.setState({ saved: res.data.media });
    })
    .catch(err => console.log(err));
  }

  handleRecommend = mediaObj => {
    mediaObj.postText = this.state.postText;
    console.log(mediaObj)
    this.setState({postText: ""})
    // set recommended = true if the mediaObj came from the user's list
    // send recommendation to user's friends
  }

  handleDelete = id => {
    mediaAPI.delete(id)
    .then(this.getShows)
    .catch(err => console.log(err))
  }

  toggleActive = id => {
    mediaAPI.toggleActive(id)
    .then(this.getShows)
    .catch(err => console.log(err))
  }

  toggleComplete = id => {
    mediaAPI.toggleComplete(id)
    .then(this.getShows)
    .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-9 main">
            <SearchForm 
              search={this.state.search}
              handleInputChange={this.handleInputChange}
              handleSearch={this.handleSearch}
              mediaType="show"
            />
            {this.state.results.length ? 
              <div className="media-wrapper">
                <h2 className="text-center">Results</h2>
                <button onClick={this.clearResults} className="btn-clear">Clear <i className="icon icon-collapse"></i></button>
                <div className="clearfix"></div>
                <Results 
                  items={this.state.results}
                  clearResults={this.clearResults}
                  resultType="results"
                  mediaType="show"
                  handleSave={this.handleSave}
                  handleRecommend={this.handleRecommend}
                  handleInputChange={this.handleInputChange}
                  postText={this.state.postText}
                />
              </div> : ""}
            <hr />
            {this.state.saved ? 
              <div className="media-wrapper">
                <h2 className="text-center">Saved Shows</h2>
                <Results 
                  items={this.state.saved}
                  resultType="saved"
                  mediaType="show"
                  handleDelete={this.handleDelete}
                  toggleActive={this.toggleActive}
                  toggleComplete={this.toggleComplete}
                  handleInputChange={this.handleInputChange}
                  postText={this.state.postText}
                  handleRecommend={this.handleRecommend}
                />
              </div> : 
              <p className="text-center empty-media-msg">Use the search bar above to find and save shows!</p> }
          </div>
          
          <Sidebar 
            items={this.state.saved}
            toggleActive={this.toggleActive}
            toggleComplete={this.toggleComplete}
            mediaType="show"
          />
          </div>
      </div>
    )
  }
};

export default Shows;
