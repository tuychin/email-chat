import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {signOut} from '../../helpers/auth';
import {db, auth} from '../../services/firebase';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
    openMenu,
    closeMenu,
    selectMenuIsOpen,
    selectTheme,
    setTheme,
} from '../../components/Menu/menuSlice';
import {
    selectCurrentUser,
    updateUserSettings,
} from '../../pages/Chat/chatSlice';

import Bevis from 'bevis';

import './menu.scss';

const block = new Bevis('menu');

const themes = [
    'Default',
    'Solar',
    'Minty',
    'Cerulean',
    'Darkly',
    'Litera',
    'Materia',
    'Sandston',
    'Slate',
    'Superhero',
    'Cosmo',
    'Flatly',
    'Lumen',
    'Simplex',
    'United',
    'Cyborg',
    'Journal',
    'Lux',
    'Pulse',
    'Sketchy',
    'Spacelab',
    'Yeti',
];

class Menu extends PureComponent {
    static propTypes = {
        menuIsOpen: PropTypes.bool,
        openMenu: PropTypes.func.isRequired,
        closeMenu: PropTypes.func.isRequired,
        currentUser: PropTypes.object.isRequired,
        updateUserSettings: PropTypes.func.isRequired,
        theme: PropTypes.string.isRequired,
        setTheme: PropTypes.func.isRequired,
    };

    static defaultProps = {
        menuIsOpen: false,
    };

    componentDidMount() {
        this.checkMenuIsOpen();
        this.fetchTheme();
    }

    checkMenuIsOpen = () => {
        const {openMenu} = this.props;
        const isOpen = localStorage.getItem('menuIsOpen');

        if (isOpen) {
            openMenu();
            localStorage.removeItem('menuIsOpen');
        }
    }

    fetchTheme = () => {
        const {setTheme} = this.props;

        db.ref(`users/${auth().currentUser.uid}/settings/theme`)
            .on('value', snapshot => {
                const theme = snapshot.val();

                theme && setTheme(theme);
            });
    }

    handleChooseTheme = (evt) => {
        const {updateUserSettings} = this.props;
        const chosenTheme = evt.target.value;

        updateUserSettings('theme', chosenTheme);
        localStorage.setItem('menuIsOpen', true);
        window.location.reload();
    }

    handleSignOut = () => {
        const {closeMenu} = this.props;

        closeMenu();
        signOut();
    }

    render() {
        const {
            menuIsOpen,
            closeMenu,
            currentUser,
            theme,
        } = this.props;

        return (
            <div className={block.name(menuIsOpen && 'open')}>
                <div className="modal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{currentUser.email}</h5>
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
                                <select
                                    className="form-control"
                                    id="chooseTheme"
                                    onChange={this.handleChooseTheme}
                                    value={theme}
                                >
                                    {themes.map((theme) => (
                                        <option value={theme.toLowerCase()} key={theme}>
                                            {theme}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="modal-footer d-flex justify-content-between">
                            <Link
                                className="text-danger"
                                onClick={this.handleSignOut}
                                to="/"
                            >
                                Выйти
                            </Link>
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
    theme: selectTheme(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    openMenu,
    closeMenu,
    updateUserSettings,
    setTheme,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
