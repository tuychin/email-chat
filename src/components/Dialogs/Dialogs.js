import React, { Component } from 'react';

class Dialogs extends Component {
    handleClick = () => {
        const {createDialog} = this.props;

        createDialog('tuychin@tetrika.school');
    }

    render() {
        return (
            <div className="vh-80 d-flex justify-content-center align-items-center col-md-4">
                <button className="btn btn-default" onClick={this.handleClick}>Создать диалог</button>
            </div>
        );
    }
}

export default Dialogs;