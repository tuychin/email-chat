import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './confirm.scss';

const Bevis = require('bevis');

const block = new Bevis('confirm');

class Confirm extends Component {
    render() {
        const {email} = this.props;

        return (
            <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
                <h1><Link to="/"> Email-chat </Link></h1>
                <h2>{`Мы отправили вам письмо с подтверждением на почту: ${email}`}</h2>
            </div>
        );
    }
}

export default Confirm;