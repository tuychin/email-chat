import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './message-history.scss';
import Loader from '../Loader';

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
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    messagesRef = React.createRef();

    scrollToBottom = () => {
        if (this.messagesRef.current) {
            this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
        }
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
            member,
            dialog,
            messages,
        } = this.props;

        return (
            <div className={`${block.name()}`}>
                {!dialog ? (
                    <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
                        <h2>Выберите, кому хотели бы написать</h2>
                    </div>
                ) : (
                    <div className={block.elem('inner')}>
                        <div className={block.elem('header')}>
                            {member}
                        </div>

                        {
                            messages.length
                                ? (
                                    <div
                                        className={`${block.elem('messages')}`}
                                        ref={this.messagesRef}
                                    >
                                        {messages.map((message) => {
                                            const {
                                                message_id,
                                                content,
                                                date_time,
                                                time_stamp,
                                                user_id,
                                            } = message;
                                            const isCurentUserMessage = user_id === user.uid;
            
                                            return (message instanceof Object) && (
                                                <div
                                                    className={block.elem('message', isCurentUserMessage ? 'right' : '')}
                                                    data-message-id={message_id}
                                                    key={`message_${time_stamp}`}
                                                >
                                                    <div
                                                        className={`${block.elem('message-inner')} card text-white
                                                            ${isCurentUserMessage ? 'bg-success' : 'bg-info'}`}
                                                    >
                                                        <div className="card-body">
                                                            <p className={`${block.elem('message-text')} card-text`}>
                                                                {content}
                                                            </p>
                                                            <span
                                                                className={`badge
                                                                    ${isCurentUserMessage ? 'badge-success' : 'badge-info'}`}
                                                            >
                                                                {date_time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className={block.elem('loader')}>
                                        <Loader />
                                    </div>
                                )
                        }

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
