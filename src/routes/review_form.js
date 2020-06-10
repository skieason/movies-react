import React from 'react';
// import { Route, useParams } from 'react-router-dom';
import { withRouter } from "react-router";
import axios from 'axios';
import { useHistory } from 'react-router';

import './review_form.css';

class ReviewForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: null,
      comment: null,
      movieTitle: null,
      movieId: null,
    };
  }

  getMovie() {
		axios.get('http://localhost:8000/api/movies/' + this.props.match.params.id + '/')
    	.then(response => {
        var movie = response.data;
        this.setState({movieTitle: movie.title, movieId: movie.id});
    	});
  }

  componentDidMount() {
    console.log('props', this.props);
    this.getMovie();
  }

  ratingChangeHandler = (event) => {
    let rating = event.target.value;
    rating = rating < 0 ? 0 : rating > 5 ? 5 : rating;
    event.target.value = rating;
    this.setState({rating: rating}, () => 
      console.log(this.state.rating));
  }

  commentChangeHandler = (event) => {
    let comment = event.target.value;
    this.setState({comment: comment}, () => 
      console.log(this.state.comment));
  }

  saveReview = (event) => {
    console.log(event);
    console.log(this.state);
    console.log(this.props)
    axios.post('http://localhost:8000/api/reviews/', {
                "review": this.state.rating,
                "comment": this.state.comment,
                "movie": this.props.match.params.id
            })
    	.then(response => {
        if (response.status === 201) {
          this.props.history.goBack();
        }
    	});
  }

  goHome (event) {
    this.props.history.push('/movies');
  }

  goMovie(event, id) {
    this.props.history.push('/movie/' + this.state.movieId);
  }

  render() {
    return (
      <div className="review">
        <div className="pointer" onClick={() => this.goHome()}>Movies Home</div>
        <form>
          <h1>Review for <span className="pointer underline" onClick={() => this.goMovie(this.state.movieId)}>{this.state.movieTitle}</span></h1>
          <div className="divider"></div>
          <p>Enter a Review Score from 0-5:</p>
          <input
            type='number'
            name='rating'
            min="0"
            max="5"
            onChange={this.ratingChangeHandler}
          />
          <p>Comments:</p>
          <input
            type='text'
            name='comment'
            onChange={this.commentChangeHandler}
          />
        </form>
        <br/>
        <div className="divider"></div>
        <br/>
        <button className="pointer" onClick={this.saveReview}>
          Save Review
        </button>
      </div>
    );
  }
}
export default withRouter(ReviewForm);