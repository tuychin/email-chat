import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Bevis from 'bevis';
import MediaQuery from 'react-responsive'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {auth} from '../../services/firebase';
import {
    setCurrentUser,
    fetchDialogs,
    showErrorMessage,
    isMessagesOpen,
    selectError,
} from './chatSlice';

import MessageHistory from '../../components/MessageHistory';
import Menu from '../../components/Menu';
import Dialogs from '../../components/Dialogs';

import './chat.scss';

const block = new Bevis('chat');

class Chat extends PureComponent {
    static propTypes = {
        setCurrentUser: PropTypes.func,
        fetchDialogs: PropTypes.func,
        showErrorMessage: PropTypes.func,
        isMessagesOpen: PropTypes.bool,
        error: PropTypes.string,
    }

    componentDidMount() {
        const {setCurrentUser, fetchDialogs} = this.props;

        setCurrentUser(auth().currentUser);
        fetchDialogs(auth().currentUser);
    }

    componentDidUpdate() {
        const {showErrorMessage, error} = this.props;

        if (error) showErrorMessage(error);
    }

    renderDesktopVersion = () => (
        <div className={`${block.elem('row')} row`}>
            <div className={`${block.elem('col')} col-md-4`}>
                <Menu />
                <Dialogs />
            </div>
            <div className={`${block.elem('col')} col-md-8`}>
                <MessageHistory />
            </div>
        </div>
    );

    renderMobileVersion = () => {
        const {isMessagesOpen} = this.props;

        return (
            <div className={`${block.elem('row')} row`}>
                {isMessagesOpen ? (
                    <div className={`${block.elem('col')} col-md-8`}>
                        <MessageHistory />
                    </div>
                ) : (
                    <div className={`${block.elem('col')} col-md-4`}>
                        <Menu />
                        <Dialogs />
                    </div>
                )}
            </div>
        );
    }

    render() {
        return (
            <div className={block.name()}>
                <div className={`${block.elem('container')} container`}>
                    <MediaQuery minWidth={768}>
                        {this.renderDesktopVersion()}
                    </MediaQuery>
                    <MediaQuery maxWidth={768}>
                        {this.renderMobileVersion()}
                    </MediaQuery>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isMessagesOpen: isMessagesOpen(state),
    error: selectError(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setCurrentUser,
    fetchDialogs,
    showErrorMessage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
