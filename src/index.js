import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import ApplicationViews from './Components/ApplicationViews';


ReactDOM.render(
  <Router>
    <ApplicationViews />
  </Router>,
  document.getElementById('root')
);
