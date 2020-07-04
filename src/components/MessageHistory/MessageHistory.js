import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './message-history.scss';

const Bevis = require('bevis');

const block = new Bevis('message-history');

export default class MessageHistory extends Component {
    state = {
        content: '',
    }

    static propTypes = {
        dialog: PropTypes.string,
        messages: PropTypes.array,
        user: PropTypes.object.isRequired,
        submit: PropTypes.func.isRequired,
        signOut: PropTypes.func.isRequired,
    }

    static defaultProps = {
        dialog: '',
        messages: [],
        alert: null,
        error: null,
    }

    сheckNoLetters = (str) => str.trim() === '';

    sendMessage = async (event) => {
        event.preventDefault();
        const {content} = this.state;
        const {submit} = this.props;

        if (this.сheckNoLetters(content)) return;

        await submit(content);
        this.setState({content: ''});
    }

    handleChange = (event) => {
        this.setState({
            content: event.target.value
        });
    }

    render() {
        const {content} = this.state;

        const {
            user,
            dialog,
            messages,
            alert,
            error,
        } = this.props;

        return (
            <div className={`${block.name()} container`}>
                {!dialog ? (
                    <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
                        <h2>Выберите, кому хотели бы написать</h2>
                    </div>
                ) : (
                    <div className="vh-100 d-flex justify-content-end align-items-end flex-column overflow-auto">
                        <div className={`${block.elem('messages')}`}>
                            {messages.map(({
                                message_id,
                                content,
                                date_time,
                                time_stamp,
                                user_id,
                                user_email,
                            }) => (
                                <div
                                    className={block.elem('message', user_id === user.uid ? 'right' : '')}
                                    data-message-id={message_id}
                                    key={`message_${time_stamp}`}
                                >
                                    <span key={`email_${time_stamp}`}>{user_email}</span>
                                    <br />
                                    <span key={`content_${time_stamp}`}>{content}</span>
                                    <br />
                                    <span key={`date_${time_stamp}`}>{date_time}</span>
                                    <hr />
                                </div>
                            ))}
                        </div>

                        <form onSubmit={this.sendMessage}>
                            <input
                                onChange={this.handleChange}
                                value={content}
                                placeholder="Сообщение"
                            />
                            {alert ? <p>{alert}</p> : null}
                            {error ? <p>{error}</p> : null}
                            <button type="submit">Отправить</button>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}
