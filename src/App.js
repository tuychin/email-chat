import React, {Component} from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';

import PrivateRoute from './hocs/withPrivateRoute';
import PublicRoute from './hocs/withPublicRoute';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Loader from './components/Loader';
import {auth} from './services/firebase';
import {checkConfirmEmail} from './helpers/auth';

import 'bootswatch/dist/solar/bootstrap.min.css';

export default class App extends Component {
    state = {
        authenticated: false,
        loading: true,
    };

    async componentDidMount() {
        await checkConfirmEmail();
        this.checkAuth();
    }

    checkAuth = () => {
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

        return loading
            ? (
                <div className="vh-100 d-flex justify-content-center align-items-center">
                    <Loader />
                </div>
            ) : (
                <Provider store={store}>
                    <Router>
                        <Switch>
                            <PublicRoute exact path="/" authenticated={authenticated} component={Login}></PublicRoute>
                            <PrivateRoute path="/chat" authenticated={authenticated} component={Chat}></PrivateRoute>
                            <Route render={() => (
                                <div className="jumbotron text-center">
                                    <h2>404<br/>Страница не найдена</h2>
                                </div>
                            )} />
                        </Switch>
                    </Router>
                </Provider>
            );
    }
}
