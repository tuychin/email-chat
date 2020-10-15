import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Bevis from 'bevis';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router-dom';
import getCurrentTime from '../../helpers/getCurrentTime';
import { signOut } from '../../helpers/auth';
import { db, auth } from '../../services/firebase';
import {
    setCurrentUser,
    setCurrentMember,
    setCurrentDialog,
    setDialogs,
    setMessages,
    setError,
    clearError,
    showErrorMessage,

    selectCurrentUser,
    selectCurrentMember,
    selectCurrentDialog,
    selectDialogs,
    selectMessages,
    selectError,
} from './chatSlice';

import MessageHistory from '../../components/MessageHistory';
import Dialogs from '../../components/Dialogs';

import './chat.scss';

const block = new Bevis('chat');

class Chat extends PureComponent {
    static propTypes = {
        setCurrentUser: PropTypes.func,
        setCurrentMember: PropTypes.func,
        setCurrentDialog: PropTypes.func,
        setDialogs: PropTypes.func,
        setMessages: PropTypes.func,
        setError: PropTypes.func,
        clearError: PropTypes.func,
        showErrorMessage: PropTypes.func,

        currentUser: PropTypes.object,
        currentMember: PropTypes.string,
        currentDialog: PropTypes.string,  
        dialogs: PropTypes.array,
        messages: PropTypes.array,
        error: PropTypes.object,
    }

    componentDidMount() {
        const {setCurrentUser} = this.props;
        const {uid, email, displayName} = auth().currentUser;

        setCurrentUser({uid, email, displayName});
        this.fetchDialogs(auth().currentUser);
    }
    
    componentDidUpdate() {
        const {showErrorMessage, error} = this.props;

        if (error) showErrorMessage(error);
    }

    createDialog = (email) => {
        const {clearError, setCurrentDialog, setError} = this.props;

        clearError();

        if (this.checkDialogExist(email)) return;

        db.ref('users')
            .orderByChild('email')
            .equalTo(email)
            .once('value',  snapshot => {

                /**check user exist */
                if (snapshot.exists()) {
                    console.warn('User exist');
                    clearError();
                    try {
                        clearError();

                        /**add dialog to /dialogs */
                        db.ref('dialogs')
                            .push(true)
                            .then((res) => {
                                setCurrentDialog(res.key);
                                this.fetchMessages(res.key);
                            })
                            .then(() => {
                                this.addDialogToAnotherUser(email);
                            })
                            .then(() => {
                                this.addDialogToCurrentUser(email);
                            })
                            .catch((error) => {
                                console.error(error);
                                setError(error.message);
                            });
            
                    } catch (error) {
                        console.error(error);
                        setError(error.message);
                    }
                } else {
                    setError('Данный пользователь не зарегистрирован');
                    console.warn('User not exist');
                }

            });
    }

    checkDialogExist = (email) => {
        const {dialogs, setError} = this.props;

        let isDialogAlredyExist = false;

        dialogs.forEach(dialog => {
            if (dialog.member === email) {
                isDialogAlredyExist = true;
                this.selectDialog(dialog.dialogId);
                setError('Такой диалог уже существует');
            }
        });

        return isDialogAlredyExist;
    }

    addDialogToCurrentUser =  async (anotherUserEmail) => {
        const {currentUser, currentDialog, setError} = this.props;

        try {
            await db.ref(`users/${currentUser.uid}/dialogs`)
                .child(currentDialog)
                .set({
                    dialogId: currentDialog,
                    member: anotherUserEmail,
                });
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }

    addDialogToAnotherUser = async (email) => {
        const {currentUser, currentDialog, setError} = this.props;

        try {
            /**get user id by email */
            await db.ref('users')
                .orderByChild('email')
                .equalTo(email)
                .on('child_added',  snapshot => {
                    const userId = snapshot.key;
                    
                    if (!userId) throw new Error('Id is undefined');
        
                    db.ref(`users/${userId}/dialogs`)
                        .child(currentDialog)
                        .set({
                            dialogId: currentDialog,
                            member: currentUser.email,
                        });
                });
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }

    fetchDialogs = (currentUser) => {
        const {setDialogs, clearError, setError} = this.props;

        clearError();

        try {
            db.ref(`users/${currentUser.uid}/dialogs`)
                .on('value', snapshot => {
                    const dialogs = [];

                    snapshot.forEach((snap) => {
                        dialogs.push(snap.val());
                    });

                    setDialogs(dialogs);
                });
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }

    selectDialog = (dialogId, memberName) => {
        const {setCurrentDialog, setCurrentMember} = this.props;

        setCurrentDialog(dialogId);
        setCurrentMember(memberName);
        this.fetchMessages(dialogId);
    }

    sendMessage = async (content) => {
        const {currentUser, currentDialog, setError, clearError} = this.props;

        clearError();

        try {
            await db.ref(`dialogs/${currentDialog}`)
                .push(true)
                .then((res) => {
                    res.set({
                        message_id: res.key,
                        content: content,
                        date_time: getCurrentTime(),
                        time_stamp: new Date().getTime(),
                        user_id: currentUser.uid,
                        user_email: currentUser.email
                    });
                })
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }

    fetchMessages = (dialogId) => {
        const {setMessages, currentDialog, setError, clearError} = this.props;

        if (dialogId || currentDialog) {
            clearError();

            try {
                db.ref(`dialogs/${dialogId || currentDialog}`)
                    .on('value', snapshot => {
                        let messages = [];
        
                        snapshot.forEach((snap) => {
                            messages.push(snap.val());
                        });
        
                        setMessages(messages);
                    });
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        }
    }

    render() {
        const {
            currentUser,
            currentMember,
            currentDialog,
            dialogs,
            messages,
        } = this.props;

        return (
            <div className={block.name()}>
                <div className={`${block.elem('container')} container`}>
                    <div className={`${block.elem('row')} row`}>
                        <div className={`${block.elem('col')} col-md-4`}>
                            <Dialogs
                                currentDialog={currentDialog}
                                dialogs={dialogs}
                                createDialog={this.createDialog}
                                selectDialog={this.selectDialog}
                            />
                        </div>
                        <div className={`${block.elem('col')} col-md-8`}>
                            <MessageHistory
                                user={currentUser}
                                member={currentMember}
                                dialog={currentDialog}
                                messages={messages}
                                submit={this.sendMessage}
                                signOut={signOut}
                            />
                        </div>
                        <div>
                            Вход выполнен через: <strong>{currentUser.email}</strong>
                            <Link to="/" onClick={signOut}> Выйти </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: selectCurrentUser(state),
    currentMember: selectCurrentMember(state),
    currentDialog: selectCurrentDialog(state),
    dialogs: selectDialogs(state),
    messages: selectMessages(state),
    error: selectError(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setCurrentUser,
    setCurrentMember,
    setCurrentDialog,
    setDialogs,
    setMessages,
    setError,
    clearError,
    showErrorMessage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
