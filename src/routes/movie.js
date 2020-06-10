import React from 'react';
import axios from 'axios';
import { withRouter } from "react-router";

import './movie.css';

class Movie extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
      movie: {
        reviews: []
      }
		}
	}
	
	componentDidMount() {
    this.getMovie();
    console.log(this.props.history);
  }

  calculateAverageRating(reviews) {
    var total = 0
    if (!reviews || reviews.length === 0) return 0;
    reviews.forEach(review => {
      total += review.review
    });
    return total / reviews.length
  }

	getMovie() {
		axios.get('http://localhost:8000/api/movies/' + this.props.match.params.id + '/')
    	.then(response => {
        var movie = response.data;
        movie.avgReview = this.calculateAverageRating(movie.reviews);
        console.log(movie);
        this.setState({movie: movie});
    	});
  }
  
  redirect(movie) {
      console.log(movie);
      this.props.history.push('/review/' + movie.id);
  }

  goHome (event) {
    this.props.history.push('/movies');
  }

  renderReviews() {
    return this.state.movie.reviews.map((review, index) => {
			return 	(
				<React.Fragment key={review.id}>
					<div>
            <div>Review Score: {review.review}</div>
            <div>Comment: {review.comment}</div>
					</div>
          <br/>
          <div className="divider"></div>
          <br/>
				</React.Fragment>
			)
		})
  }

	render() {
		return (
      <React.Fragment key={this.props.match.params.id}>
        <div className="movie">
          <div className="pointer" onClick={() => this.goHome()}>Movies Home</div>
          <br/>
          <div>
              <h3>{this.state.movie.title}</h3>
              <div>Release Date: {this.state.movie.released_on}</div>
              <div>Rated: {this.state.movie.rated}</div>
              <div>Genre: {this.state.movie.genre}</div>
              <div>Director: {this.state.movie.director}</div>
              <br/>
              <div>Synopsis: {this.state.movie.plot}</div>
              <br/>
              <div>Average Review(0-5): {this.state.movie.avgReview}</div>
              <button onClick={() => this.redirect(this.state.movie)}>Leave a Review</button>
            </div>
            <br/>
            <div className="divider"></div>
            <br/>
            <div>{ this.renderReviews() }</div>
        </div>
      </React.Fragment>
		)
	}
}

export default withRouter(Movie);
