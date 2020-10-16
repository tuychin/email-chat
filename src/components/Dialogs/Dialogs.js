import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Bevis from 'bevis';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    selectCurrentDialog,
    selectDialogs,

    createDialog,
    chooseDialog,
    openMessages,
} from '../../pages/Chat/chatSlice';
import {openMenu} from '../../components/Menu/menuSlice';

import './dialogs.scss';
import Loader from '../Loader';

const block = new Bevis('dialogs');

class Dialogs extends PureComponent {
    state = {
        email: '',
    }

    static propTypes = {
        dialogs: PropTypes.array,
        currentDialog: PropTypes.string,
        createDialog: PropTypes.func.isRequired,
        chooseDialog: PropTypes.func.isRequired,
        openMenu: PropTypes.func.isRequired,
        openMessages: PropTypes.func.isRequired,
    }

    static defaultProps = {
        dialogs: [],
        currentDialog: '',
    }

    handleChangeForm = (event) => {
        this.setState({
            email: event.target.value
        });
    }

    handleCreateDialog = (evt) => {
        evt.preventDefault();
        const {email} = this.state;
        const {createDialog} = this.props;

        createDialog(email);
        this.setState({email: ''});
    }

    handleChooseDialog = (evt) => {
        evt.preventDefault();
        const {chooseDialog, openMessages} = this.props;
        const dialogId = evt.target.dataset.dialogId;
        const memberName = evt.target.dataset.memberName;

        chooseDialog(dialogId, memberName);
        openMessages();
    }

    render() {
        const {email} = this.state;
        const {
            dialogs,
            openMenu,
        } = this.props;

        return (
            <div className={block.name()}>
                <div className={block.elem('header')}>
                    <button
                        className={`${block.elem('button')} btn btn-primary`}
                        onClick={openMenu}
                    >
                        ☰
                    </button>
                </div>

                {dialogs.length ? (
                    <ul className={`${block.elem('list')} list-group`}>
                        {dialogs.map(dialog => (
                            <li
                                className={`${block.elem('list-item')} list-group-item list-group-item-action`}
                                onClick={this.handleChooseDialog}
                                data-dialog-id={dialog.dialogId}
                                data-member-name={dialog.member}
                                key={dialog.dialogId}
                                href="#"
                            >
                                {dialog.member}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className={block.elem('loader')}>
                        <Loader />
                    </div>
                )}

                <div className={block.elem('footer')}>
                    <form
                        className={`${block.elem('form')} form-group w-100`}
                        onSubmit={this.handleCreateDialog}
                    >
                        <input
                            className={`${block.elem('input')} form-control`}
                            onChange={this.handleChangeForm}
                            value={email}
                            placeholder="email"
                            required
                        />

                        <button
                            className={`${block.elem('button')} btn btn-primary`}
                            type="submit"
                        >
                            Создать диалог
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    currentDialog: selectCurrentDialog(state),
    dialogs: selectDialogs(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    createDialog,
    chooseDialog,
    openMenu,
    openMessages,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dialogs);
