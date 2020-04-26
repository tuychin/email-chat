import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        alert: null,
        error: null,
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
        const {selectDialog} = this.props;
        const dialogId = evt.target.dataset.dialogId;

        selectDialog(dialogId);
    }

    render() {
        const {email} = this.state;
        const {
            dialogs,
            alert,
            error,
        } = this.props;

        return (
            <div className="vh-100 d-flex flex-column justify-content-between align-items-center col-md-4 border">
                <div className="d-flex flex-column">
                    {dialogs && 
                        dialogs.map(dialog => (
                            <button
                                className="btn btn-outline-secondary"
                                onClick={this.selectDialog}
                                data-dialog-id={dialog.dialogId}
                                key={dialog.dialogId}
                            >
                                {dialog.member}
                            </button>
                        ))
                    }
                </div>
                <form onSubmit={this.createDialog}>
                    <input
                        onChange={this.handleChange}
                        value={email}
                        placeholder="email"
                    />
                    {alert ? <p>{alert}</p> : null}
                    {error ? <p>{error}</p> : null}
                    <button type="submit">
                        Создать диалог
                    </button>
                </form>
            </div>
        );
    }
}

export default Dialogs;
