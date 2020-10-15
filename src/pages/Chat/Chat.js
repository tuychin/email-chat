import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Bevis from 'bevis';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { signOut } from '../../helpers/auth';
import {
    setCurrentUser,
    fetchDialogs,
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
        fetchDialogs: PropTypes.func,
        showErrorMessage: PropTypes.func,

        currentUser: PropTypes.object,
        currentMember: PropTypes.string,
        currentDialog: PropTypes.string,  
        dialogs: PropTypes.array,
        messages: PropTypes.array,
        error: PropTypes.string,
    }

    componentDidMount() {
        const {setCurrentUser, fetchDialogs} = this.props;
        const {uid, email, displayName} = auth().currentUser;

        setCurrentUser({uid, email, displayName});
        fetchDialogs(auth().currentUser);
    }
    
    componentDidUpdate() {
        const {showErrorMessage, error} = this.props;

        if (error) showErrorMessage(error);
    }

    render() {
        const {currentUser} = this.props;

        return (
            <div className={block.name()}>
                <div className={`${block.elem('container')} container`}>
                    <div className={`${block.elem('row')} row`}>
                        <div className={`${block.elem('col')} col-md-4`}>
                            <Dialogs />
                        </div>
                        <div className={`${block.elem('col')} col-md-8`}>
                            <MessageHistory />
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
    fetchDialogs,
    showErrorMessage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
