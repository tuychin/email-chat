import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './confirm.scss';

const Bevis = require('bevis');

const block = new Bevis('confirm');

class Confirm extends Component {
    render() {
        const {email} = this.props;

        return (
            <div>
                <h1><Link to="/"> Email-chat </Link></h1>
                <p>{`Мы отправили вам письмо с подтверждением на почту: ${email}`}</p>
            </div>
        );
    }
}

export default Confirm;