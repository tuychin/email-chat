import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Bevis from 'bevis';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    selectDialogs,

    createDialog,
    openDialog,
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
        createDialog: PropTypes.func.isRequired,
        openDialog: PropTypes.func.isRequired,
        openMenu: PropTypes.func.isRequired,
    }

    handleChangeForm = (evt) => {
        this.setState({
            email: evt.target.value
        });
    }

    handleCreateDialog = (evt) => {
        evt.prevtDefault();
        const {email} = this.state;
        const {createDialog} = this.props;

        createDialog(email);
        this.setState({email: ''});
    }

    handleOpenDialog = (evt) => {
        evt.prevtDefault();
        const {openDialog} = this.props;
        const dialogId = evt.target.dataset.dialogId;
        const memberName = evt.target.dataset.memberName;

        this.setUrlHash(dialogId);
        openDialog(dialogId, memberName);
    }

    setUrlHash = dialogId => location.hash = dialogId;

    renderDialogsPlaceholder = () => {
        const {dialogs} = this.props;

        if (dialogs === null) {
            return (
                <div className={block.elem('placeholder')}>
                    <Loader />
                </div>
            );
        }

        return (
            <div className={block.elem('placeholder')}>
                <div className="h-100 d-flex justify-content-center align-items-center p-2">
                    <h2 className="text-center">Создайте диалог</h2>
                </div>
            </div>
        );
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

                {dialogs && dialogs.length ? (
                    <ul className={`${block.elem('list')} list-group`}>
                        {dialogs.map(dialog => (
                            <li
                                className={`${block.elem('list-item')} list-group-item list-group-item-action`}
                                onClick={this.handleOpenDialog}
                                data-dialog-id={dialog.dialogId}
                                data-member-name={dialog.member.email}
                                key={dialog.dialogId}
                                href="#"
                            >
                                {dialog.member.email}
                            </li>
                        ))}
                    </ul>
                ) : this.renderDialogsPlaceholder()}

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
    dialogs: selectDialogs(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    createDialog,
    openDialog,
    openMenu,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dialogs);
