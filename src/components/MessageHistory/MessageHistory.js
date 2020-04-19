import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import './message-history.css';

export default class MessageHistory extends Component {
    state = {
        content: '',
    }

    static propTypes = {
        user: PropTypes.object.isRequired,
        messages: PropTypes.array.isRequired,
        submit: PropTypes.func.isRequired,
    }

    static defaultProps = {
        error: null,
    }

    сheckNoLetters = (str) => str.trim() === '';

    handleSubmit = async (event) => {
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
            messages,
            error,
        } = this.props;

        return (
            <div className="col-md-6">
                <div className="messages">
                    {messages.map(({
                        content,
                        date_time,
                        time_stamp,
                        user_id,
                        user_email,
                    }) => (
                        <div
                            key={time_stamp}
                            className={user_id === user.uid ? '_right' : ''}
                        >
                            <span>{user_email}</span>
                            <br />
                            <span>{content}</span>
                            <br />
                            <span>{date_time}</span>
                            <hr />
                        </div>
                    ))}
                </div>

                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        value={content}
                        placeholder="Сообщение"
                    />
                    {error ? <p>{error}</p> : null}
                    <button type="submit">Отправить</button>
                </form>
            </div>
        );
    }
}
