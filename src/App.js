import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import './App.css';

const Movies = lazy(() => import('./routes/movies'));
const Movie = lazy(() => import('./routes/movie'));
const ReviewForm = lazy(() => import('./routes/review_form'));

function App() {
  // var id = useParams()
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/movies" component={Movies}></Route>
          <Route path="/movie/:id" component={Movie}></Route>
          <Route path="/review/:id" component={ReviewForm}></Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
