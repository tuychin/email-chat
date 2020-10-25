import React, {PureComponent} from 'react';
import Bevis from 'bevis';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    selectCurrentUser,
    selectCurrentMemberEmail,
    selectCurrentDialog,
    selectDialogs,
    selectMessages,

    sendMessage,
    closeMessages,
} from '../../pages/Chat/chatSlice';

import {sendNotificationToUser} from '../../services/firebase';

import './message-history.scss';
import Loader from '../Loader';

const block = new Bevis('message-history');

class MessageHistory extends PureComponent {
    state = {
        content: '',
    }

    static propTypes = {
        currentDialogId: PropTypes.string,
        dialogs: PropTypes.array,
        messages: PropTypes.array,
        user: PropTypes.object.isRequired,
        memberEmail: PropTypes.string.isRequired,
        sendMessage: PropTypes.func.isRequired,
        closeMessages: PropTypes.func.isRequired,
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

    сheckNoSpacesInMessageText = (str) => str.trim() !== '';

    sendMessage = async (event) => {
        event.preventDefault();
        const {content} = this.state;
        const {user, dialogs, currentDialogId, sendMessage} = this.props;
        const currentDialog = dialogs.filter(dialog => dialog.dialogId === currentDialogId)[0];
        
        if (this.сheckNoSpacesInMessageText(content)) {
            const currentDialogLink = location.href;

            await sendMessage(content);
            await sendNotificationToUser({
                title: `Новое сообщение от: ${user.email}`,
                body: content,
                link: currentDialogLink,
                token: currentDialog.member.messagingToken,
            });

            this.setState({content: ''});
        }
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

    renderMessagesPlaceholder = () => {
        const {messages} = this.props;

        if (messages === null) {
            return (
                <div className={block.elem('placeholder')}>
                    <Loader />
                </div>
            );
        }

        return (
            <div className={block.elem('placeholder')}>
                <div className="h-100 d-flex justify-content-center align-items-center p-2">
                    <h2 className="text-center">Напишите первое сообщение</h2>
                </div>
            </div>
        );
    }

    render() {
        const {content} = this.state;

        const {
            memberEmail,
            dialogs,
            currentDialogId,
            messages,
            closeMessages,
        } = this.props;

        return (
            <div className={`${block.name()}`}>
                {!currentDialogId ? (
                    <div className="vh-100 d-flex justify-content-center align-items-center p-2">
                        {(dialogs && dialogs.length) ? (
                            <h2 className="text-center">Выберите, кому хотели бы написать</h2>
                        ) : ''}
                    </div>
                ) : (
                    <div className={block.elem('inner')}>
                        <div className={block.elem('header')}>
                            <MediaQuery maxWidth={768}>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeMessages}
                                >
                                    ←
                                </button>
                            </MediaQuery>
                            <div className={block.elem('member')}>
                                {memberEmail}
                            </div>
                        </div>

                        {messages && messages.length ? (
                            <div
                                className={`${block.elem('messages')}`}
                                ref={this.messagesRef}
                            >
                                {messages.map((message) => this.renderMessage(message))}
                            </div>
                        ) : this.renderMessagesPlaceholder()}

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
    memberEmail: selectCurrentMemberEmail(state),
    dialogs: selectDialogs(state),
    currentDialogId: selectCurrentDialog(state),
    messages: selectMessages(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendMessage,
    closeMessages,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MessageHistory);
