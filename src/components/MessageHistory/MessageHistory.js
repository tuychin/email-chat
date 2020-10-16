import React, {PureComponent} from 'react';
import Bevis from 'bevis';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    selectCurrentUser,
    selectCurrentMember,
    selectCurrentDialog,
    selectMessages,

    sendMessage,
} from '../../pages/Chat/chatSlice';

import './message-history.scss';
import Loader from '../Loader';

const block = new Bevis('message-history');

class MessageHistory extends PureComponent {
    state = {
        content: '',
    }

    static propTypes = {
        dialog: PropTypes.string,
        messages: PropTypes.array,
        user: PropTypes.object.isRequired,
        member: PropTypes.string.isRequired,
        sendMessage: PropTypes.func.isRequired,
    }

    static defaultProps = {
        dialog: '',
        messages: [],
    }

    componentDidMount() {
        this.scrollToBottom();
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
        const {sendMessage} = this.props;

        if (this.сheckNoLetters(content)) return;

        await sendMessage(content);
        this.setState({content: ''});
    }

    handleChange = (event) => {
        this.setState({
            content: event.target.value
        });
    }

    renderMessage = (message) => {
        const {user} = this.props;

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
    }

    render() {
        const {content} = this.state;

        const {
            member,
            dialog,
            messages,
        } = this.props;

        return (
            <div className={`${block.name()}`}>
                {!dialog ? (
                    <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
                        <h3>Выберите, кому хотели бы написать</h3>
                    </div>
                ) : (
                    <div className={block.elem('inner')}>
                        <div className={block.elem('header')}>
                            {member}
                        </div>

                        {messages.length ? (
                            <div
                                className={`${block.elem('messages')}`}
                                ref={this.messagesRef}
                            >
                                {messages.map((message) => this.renderMessage(message))}
                            </div>
                        ) : (
                            <div className={block.elem('loader')}>
                                <Loader />
                            </div>
                        )}

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

const mapStateToProps = (state) => ({
    user: selectCurrentUser(state),
    member: selectCurrentMember(state),
    dialog: selectCurrentDialog(state),
    messages: selectMessages(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendMessage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MessageHistory);
