import React, { Component } from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom';
import PrivateRoute from './hocs/withPrivateRoute';
import PublicRoute from './hocs/withPublicRoute';
import Chat from './pages/Chat';
import Login from './pages/Login';
import { auth } from './services/firebase';
import { checkEmail } from './helpers/auth';

import 'bootswatch/dist/solar/bootstrap.min.css';

export default class App extends Component {
    state = {
        authenticated: false,
        loading: true,
    };

    async componentDidMount() {
        await checkEmail();

        auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    authenticated: true,
                    loading: false,
                });
            } else {
                this.setState({
                    authenticated: false,
                    loading: false,
                });
            }
        });
    }

    render() {
        const {authenticated, loading} = this.state;

        return loading ? <h2>Loading...</h2> : (
            <Router>
                <Switch>
                    <PublicRoute exact path="/" authenticated={authenticated} component={Login}></PublicRoute>
                    <PrivateRoute path="/chat" authenticated={authenticated} component={Chat}></PrivateRoute>
                    <Route render={() => (
                        <div className="jumbotron text-center">
                            <h2>404<br/>Page not found</h2>
                        </div>
                    )} />
                </Switch>
            </Router>
        );
    }
}
