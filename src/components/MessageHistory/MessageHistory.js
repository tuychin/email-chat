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
            error,
        } = this.props;

        return (
            <div className={`${block.name()} container`}>
                {!dialog ? (
                    <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
                        <h2>Выберите, кому хотели бы написать</h2>
                    </div>
                ) : (
                    <div className={block.elem('inner')}>
                        <div className={`${block.elem('messages')}`}>
                            <div className={`${block.elem('messages-scroll')}`}>
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
                                        <div
                                            className={`${block.elem('message-inner')} card text-white
                                                ${user_id === user.uid ? 'bg-success' : 'bg-info'}`}
                                        >
                                            <div className="card-header">
                                                {user_email}
                                            </div>
                                            <div className="card-body">
                                                <p className="card-text">
                                                    {content}
                                                </p>
                                                <span
                                                    className={`badge
                                                        ${user_id === user.uid ? 'badge-success' : 'badge-info'}`}
                                                >
                                                    {date_time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <form
                            className={`${block.elem('form')} form-group`}
                            onSubmit={this.sendMessage}
                        >
                            <input
                                className={`${block.elem('input')} form-control`}
                                onChange={this.handleChange}
                                value={content}
                                placeholder="Сообщение"
                            />
                            {error ? <p>{error}</p> : null}
                            <button
                                className={`${block.elem('button')} btn btn-primary`}
                                type="submit"
                            >
                                Отправить
                            </button>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}
