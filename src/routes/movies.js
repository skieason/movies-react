import React from 'react';
import axios from 'axios';
import { withRouter } from "react-router";

import './movies.css';

class Movies extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
      movies: [],
      filteredMovies: [],
      search: null,
      dateSort: 'Off'
		}
	}
	
	componentDidMount() {
    this.getMovies();
    console.log('props', this.props);
	}
  
  calculateAverageRating(reviews) {
    var total = 0
    if (!reviews || reviews.length === 0) return 0;
    reviews.forEach(review => {
      total += review.review
    });
    return total / reviews.length
  }

	getMovies() {
		axios.get('http://localhost:8000/api/movies')
    	.then(response => {
        response.data.map(movie => {
          return movie.avgReview = this.calculateAverageRating(movie.reviews);
        });
        console.log(response.data);
        this.setState({movies: response.data, filteredMovies: response.data.filter(() => true)});
    	});
  }
  
  redirect(movie) {
      console.log(movie);
      this.props.history.push('/review/' + movie.id);
  }

  goMovie(id) {
    this.props.history.push('/movie/' + id);
  }

	renderMoviesList() {
    // .filter((movie) => {return (movie.title.includes(this.state.search))})
    return this.state.filteredMovies.map((movie, index) => {
			return 	(
				<React.Fragment key={movie.id}>
					<div>
            <div>Title: <span className="pointer underline" onClick={() => this.goMovie(movie.id)}>{movie.title}</span></div>
            <div>Release Date: {movie.released_on}</div>
            <div>Rated: {movie.rated}</div>
            <div>Genre: {movie.genre}</div>
            <div>Director: {movie.director}</div>
            <br/>
            <div>Synopsis: {movie.plot}</div>
            <br/>
            <div>Average Review(0-5): {movie.avgReview}</div>
            <br/>
            <button onClick={() => this.redirect(movie)}>Review this Movie!</button>
					</div>
          <br/>
          <div className="divider"></div>
          <br/>
				</React.Fragment>
			)
		})
  }

  filterMovies = (movie) => {
    return (this.state.search === '' || this.state.search === null || movie.title.toLowerCase().includes(this.state.search.toLowerCase())) ||
              (movie.released_on.toLowerCase().includes(this.state.search.toLowerCase())) ||
              (movie.rated.toLowerCase().includes(this.state.search.toLowerCase())) ||
              (movie.genre.toLowerCase().includes(this.state.search.toLowerCase())) ||
              (movie.plot.toLowerCase().includes(this.state.search.toLowerCase())) ||
              (movie.director.toLowerCase().includes(this.state.search.toLowerCase()))
  }

  applyFilter = () => {
    this.setState({filteredMovies: this.state.movies.filter((movies) => this.filterMovies(movies))});
  }

  applySort = (sortMethod) => {
    this.setState({filteredMovies: this.state.filteredMovies.sort((movieA, movieB) => sortMethod(movieA, movieB))})
  }
  
  searchChangeHandler = (event) => {
    let search = event.target.value;
    this.state.search = search;
    this.applyFilter();
    this.state.dateSort = 'Off';
  }

  sortByDateToggle = (event) => {
    if (this.state.dateSort === 'Off') {
      this.setState({dateSort: 'Ascending'});
      this.applySort(this.ascending);
    } else if (this.state.dateSort === 'Ascending') {
      this.setState({dateSort: 'Descending'});
      this.applySort(this.descending);
    } else if (this.state.dateSort === 'Descending') {
      this.setState({dateSort: 'Off'});
      this.applyFilter();
    }
  }

  ascending = (a, b) => {
    return new Date(a.released_on).getTime() - new Date(b.released_on).getTime()
  }
  descending = (a, b) => {
    return new Date(b.released_on).getTime() - new Date(a.released_on).getTime()
  }
  

	render() {
		return (
      <div className="movies">
        <h3>All Movies</h3>
        <input
          type='text'
          name='search'
          placeholder='Search'
          autocomplete="off"
          onChange={this.searchChangeHandler}
        />
        <button onClick={this.sortByDateToggle}>Sort By Release Date:  {this.state.dateSort}</button>
        <br/>
        <br/>
        <div className="divider"></div>
        <br/>
        <div>{ this.renderMoviesList() }</div>
      </div>
		)
	}
}

export default withRouter(Movies);
