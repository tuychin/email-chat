import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './dialogs.scss';
import Loader from '../Loader';

const Bevis = require('bevis');

const block = new Bevis('dialogs');

class Dialogs extends Component {
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

        selectDialog(dialogId);
    }

    render() {
        const {email} = this.state;
        const {
            dialogs,
        } = this.props;

        return (
            <div className={`${block.name()} container`}>
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

                {dialogs.length
                    ? (
                        <div className={`${block.elem('list')} list-group`}>
                            {dialogs.map(dialog => (
                                <a
                                    className={`${block.elem('list-item')} list-group-item list-group-item-action`}
                                    onClick={this.selectDialog}
                                    data-dialog-id={dialog.dialogId}
                                    key={dialog.dialogId}
                                    href="#"
                                >
                                    {dialog.member}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <Loader />
                    )
                }
            </div>
        );
    }
}

export default Dialogs;
