import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import './Root.css';

import PubSwipper from '../component/PubSwipper';
import HomeContainer from './HomeContainer';

function Root() {
    return (
        <Router>
            <Switch>
                <HomeContainer>
                    <Route exact path="/" component={PubSwipper} />
                </HomeContainer>
            </Switch>
        </Router>
    );
}

export default Root;
