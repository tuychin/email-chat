import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import './confirm.scss';

const Bevis = require('bevis');

const block = new Bevis('confirm');

class Confirm extends PureComponent {
    render() {
        const {email} = this.props;

        return (
            <div className={block.name()}>
                <h1>{`Мы отправили вам письмо с подтверждением на почту: ${email}`}</h1>
                <h2>Перейдите по ссылке в письме, чтобы войти в свой профиль.</h2>
            </div>
        );
    }
}

export default Confirm;