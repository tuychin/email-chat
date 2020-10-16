import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Bevis from 'bevis';

import './confirm.scss';

const block = new Bevis('confirm');

class Confirm extends PureComponent {
    static propTypes = {
        email: PropTypes.string.isRequired,
    }

    render() {
        const {email} = this.props;

        return (
            <div className={block.name()}>
                <h1 className="text-center">{`Мы отправили вам письмо с подтверждением на почту: ${email}`}</h1>
                <h2 className="text-center">Перейдите по ссылке в письме, чтобы войти в свой профиль.</h2>
            </div>
        );
    }
}

export default Confirm;