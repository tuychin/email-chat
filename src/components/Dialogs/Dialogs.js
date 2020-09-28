import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './dialogs.scss';
import Loader from '../Loader';

const Bevis = require('bevis');

const block = new Bevis('dialogs');

class Dialogs extends PureComponent {
    state = {
        email: '',
    }

    static propTypes = {
        dialogs: PropTypes.array,
        currentDialog: PropTypes.string,
        createDialog: PropTypes.func.isRequired,
        selectDialog: PropTypes.func.isRequired,
    }

    static defaultProps = {
        dialogs: [],
        currentDialog: '',
    }

    handleChange = (event) => {
        this.setState({
            email: event.target.value
        });
    }

    createDialog = (evt) => {
        evt.preventDefault();
        const {email} = this.state;
        const {createDialog} = this.props;

        createDialog(email);
        this.setState({email: ''});
    }

    selectDialog = (evt) => {
        evt.preventDefault();
        const {selectDialog} = this.props;
        const dialogId = evt.target.dataset.dialogId;
        const memberName = evt.target.dataset.memberName;

        selectDialog(dialogId, memberName);
    }

    render() {
        const {email} = this.state;
        const {
            dialogs,
        } = this.props;

        return (
            <div className={block.name()}>
                <div className={block.elem('header')}>
                    <form
                        className={`${block.elem('form')} form-group`}
                        onSubmit={this.createDialog}
                    >
                        <input
                            className={`${block.elem('input')} form-control`}
                            onChange={this.handleChange}
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

                {dialogs.length
                    ? (
                        <ul className={`${block.elem('list')} list-group`}>
                            {dialogs.map(dialog => (
                                <li
                                    className={`${block.elem('list-item')} list-group-item list-group-item-action`}
                                    onClick={this.selectDialog}
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
                    )
                }
            </div>
        );
    }
}

export default Dialogs;
