import React from 'react';
import { Component} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import VideoPlayer from './component/videoplayer';
import Collabo from './component/collabo';

class Root extends Component {
  render() {
    return (
        <Router>
              <Switch>
                <Route exact path="/" component={VideoPlayer} />
                <Route path="/collabo" component={Collabo} />
              </Switch>
        </Router>
    );
  }
}

export default Root;
