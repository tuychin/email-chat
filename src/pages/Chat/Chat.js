import React, {Component} from 'react';
import getCurrentTime from '../../helpers/getCurrentTime';
import { Link } from 'react-router-dom';
import {signOut} from '../../helpers/auth';
import {auth} from '../../services/firebase';
import {db} from '../../services/firebase';

import MessageHistory from '../../components/MessageHistory';
import Dialogs from '../../components/Dialogs';

import './chat.css';

export default class Chat extends Component {
    state = {
        user: auth().currentUser,
        messages: [],
        error: null,
    };

    async componentDidMount() {
        this.getMessages();
    }

    getMessages = () => {
        this.setState({error: null});
        try {
            db.ref('messages').on('value', snapshot => {
                let messages = [];

                snapshot.forEach((snap) => {
                    messages.push(snap.val());
                });

                this.setState({messages});
            });
        } catch (error) {
            console.log(error);
            this.setState({error: error.message});
        }
    }

    submitMessage = async (content) => {
        const {user} =this.state;

        this.setState({error: null});
        try {
            await db.ref('messages').push({
                content: content,
                date_time: getCurrentTime(),
                time_stamp: Date.now(),
                user_id: user.uid,
                user_email: user.email
            });
        } catch (error) {
            console.log(error);
            console.log(111);
            this.setState({error: error.message});
        }
    }

    render() {
        const {
            user,
            messages,
            error,
        } = this.state;

        return (
            <div>
                <h1><Link to="/"> Email-chat </Link></h1>
                <div className="row">
                    <Dialogs />
                    <MessageHistory
                        user={user}
                        messages={messages}
                        submit={this.submitMessage}
                        signOut={signOut}
                        error={error}
                    />
                </div>
                <div>
                    Вход выполнен через: <strong>{user.email}</strong>
                    <Link to="/" onClick={signOut}> Выйти </Link>
                </div>
            </div>
        );
    }
}
