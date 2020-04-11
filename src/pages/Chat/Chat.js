import React, { Component } from 'react';
import getTimeNow from '../../helpers/getTimeNow';
import { Link } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { db } from '../../services/firebase';
import { signOut } from '../../helpers/auth';

import './chat.css';

export default class Chat extends Component {
    state = {
        user: auth().currentUser,
        chats: [],
        content: '',
        readError: null,
        writeError: null
    };

    async componentDidMount() {
        this.setState({ readError: null });

        try {
            db.ref('chats').on('value', snapshot => {
                let chats = [];

                snapshot.forEach((snap) => {
                    chats.push(snap.val());
                });

                this.setState({ chats });
            });
        } catch (error) {
            this.setState({ readError: error.message });
        }
    }

    handleChange = (event) => {
        this.setState({
            content: event.target.value
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({ writeError: null });

        try {
            await db.ref('chats').push({
                content: this.state.content,
                time: getTimeNow(),
                time_stamp: Date.now(),
                user_id: this.state.user.uid,
                user_email: this.state.user.email
            });

            this.setState({ content: '' });
        } catch (error) {
            this.setState({ writeError: error.message });
        }
    }

    render() {
        return (
            <div>
                <h1><Link to="/"> Email-chat </Link></h1>
                <div className="chats">
                    {this.state.chats.map(({
                        content,
                        time,
                        time_stamp,
                        user_id,
                        user_email,
                    }) => (
                        <div
                            key={time_stamp}
                            className={user_id === this.state.user.uid ? '_right' : ''}
                        >
                            <span>{user_email}</span>
                            <br />
                            <span>{content}</span>
                            <br />
                            <span>{time}</span>
                            <hr />
                        </div>
                    ))}
                </div>

                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} value={this.state.content}></input>
                    {this.state.error ? <p>{this.state.writeError}</p> : null}
                    <button type="submit">Send</button>
                </form>

                <div>
                    Login in as: <strong>{this.state.user.email}</strong>
                    <Link to="/" onClick={signOut}> Exit </Link>
                </div>
            </div>
        );
    }
}
