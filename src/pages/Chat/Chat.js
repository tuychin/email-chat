import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Bevis from 'bevis';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {auth} from '../../services/firebase';
import {
    setCurrentUser,
    fetchDialogs,
    showErrorMessage,
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

    render() {
        return (
            <div className={block.name()}>
                <div className={`${block.elem('container')} container`}>
                    <div className={`${block.elem('row')} row`}>
                        <div className={`${block.elem('col')} col-md-4`}>
                            <Menu />
                            <Dialogs />
                        </div>
                        <div className={`${block.elem('col')} col-md-8`}>
                            <MessageHistory />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    error: selectError(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setCurrentUser,
    fetchDialogs,
    showErrorMessage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
