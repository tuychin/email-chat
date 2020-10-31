import React, {Component} from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';

import Chat from './pages/Chat';
import Login from './pages/Login';
import Loader from './components/Loader';
import {
    sendNotificationTokenToServer,
    auth,
    db
} from './services/firebase';
import {checkConfirmEmail} from './utils/auth';

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss';

export default class App extends Component {
    state = {
        authenticated: false,
        loading: true,
    };

    async componentDidMount() {
        auth().onAuthStateChanged((user) => {
            if (user) {
                sendNotificationTokenToServer();

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

        await checkConfirmEmail();
        await this.importUserTheme();
    }

    importUserTheme = () => {
        auth().onAuthStateChanged((user) => {
            if (user) {
                db.ref(`users/${user.uid}/theme`)
                    .once('value', snapshot => {
                        const theme = snapshot.val();

                        if (theme && theme !== 'default') {
                            import(`bootswatch/dist/${theme}/bootstrap.min.css`);
                        }

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
                            <Route exact path="/" render={() => authenticated ?
                                <Chat /> :
                                <Login />
                            } />
                            <Route render={() => (
                                <div className="text-center vh-100 d-flex justify-content-center align-items-center">
                                    <h2>Ошибка 404<br/>Страница не найдена</h2>
                                </div>
                            )} />
                        </Switch>
                    </Router>
                </Provider>
            );
    }
}
