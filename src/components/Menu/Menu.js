import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {signOut} from '../../helpers/auth';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    closeMenu,
    selectMenuIsOpen,
} from '../../components/Menu/menuSlice';
import {selectCurrentUser} from '../../pages/Chat/chatSlice';

import Bevis from 'bevis';

import './menu.scss';

const block = new Bevis('menu');

class Menu extends PureComponent {
    static propTypes = {
        menuIsOpen: PropTypes.bool,
        closeMenu: PropTypes.func.isRequired,
        currentUser: PropTypes.object.isRequired,
    };

    static defaultProps = {
        menuIsOpen: false,
    };

    componentDidMount() {}

    handleSignOut = () => {
        const {closeMenu} = this.props;

        closeMenu();
        signOut();
    }

    render() {
        const {menuIsOpen, closeMenu, currentUser} = this.props;

        return (
            <div className={block.name(menuIsOpen && 'open')}>
                <div className="modal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Профиль: <strong>{currentUser.email}</strong></h5>
                            <button
                                type="button"
                                className="close"
                                onClick={closeMenu}
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="chooseTheme">Тема:</label>
                                <select className="form-control" id="chooseTheme">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-footer d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-warning"
                                onClick={this.handleSignOut}
                            >
                                Выйти из профиля
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={closeMenu}
                                data-dismiss="modal"
                            >
                                Закрыть
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    menuIsOpen: selectMenuIsOpen(state),
    currentUser: selectCurrentUser(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    closeMenu,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
