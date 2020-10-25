import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Bevis from 'bevis';
import { sendConfirmEmail, signInWithGoogle, signInWithGitHub } from '../../utils/auth';
import withInstallPwaApp from '../../hocs/withInstallPwaApp';

import Confirm from '../../components/Confirm';

import './login.scss';

const block = new Bevis('login');

class Login extends PureComponent {
    static propTypes = {
        appIsInstalled: PropTypes.bool,
        installApp: PropTypes.func,
    };

    state = {
        error: null,
        email: '',
        showConfirm: false,
    };

    componentDidUpdate() {
        const {error} = this.state;

        if (error) {
            this.showErrorMessage(error);
        }
    }

    showErrorMessage = (errorMessage) => {
        alert(errorMessage)
        this.setState({error: null});
    }

    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value
        });
    }

    handleSubmit = async (evt) => {
        const {email} = this.state;

        evt.prevtDefault();
        this.setState({error: ''});

        try {
            await sendConfirmEmail(email);
            this.setState({showConfirm: true});
        } catch (error) {
            console.error(error);
            this.setState({error: error.message});
        }
    }

    googleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error(error);
            this.setState({error: error.message});
        }
    }

    githubSignIn = async () => {
        try {
            await signInWithGitHub();
        } catch (error) {
            console.error(error);
            this.setState({error: error.message});
        }
    }

    render() {
        const {
            showConfirm,
            email,
        } = this.state;

        const {
            appIsInstalled,
            installApp,
        } = this.props;

        return (
            showConfirm ? <Confirm email={email} /> : (
                <div className={block.name()}>
                    <div className={block.elem('title')}>
                        <h1 className="text-center">Всё что вам нужно, чтобы начать общение - электронная почта!</h1>
                    </div>

                    <form className={block.elem('form')} onSubmit={this.handleSubmit}>
                        <input
                            className={`${block.elem('input')} form-control`}
                            placeholder="Email"
                            name="email"
                            type="email"
                            onChange={this.handleChange}
                            value={email}
                        />
    
                        <button className={`${block.elem('button')} btn btn-primary`} type="submit">
                            Войти
                        </button>
                    </form>

                    <div className={`${block.elem('sign-in')}`}>
                        <div className={block.elem('wrapper')}>
                            <button
                                className="btn btn-secondary"
                                onClick={this.googleSignIn}
                                type="button"
                            >
                                Войти с Google
                            </button>
                            {' '}
                            <button
                                className="btn btn-secondary"
                                type="button"
                                onClick={this.githubSignIn}
                            >
                                Войти с GitHub
                            </button>
                        </div>
                    </div>
                    {!appIsInstalled && (
                        <button
                            type="button"
                            className="btn btn-info m-3"
                            onClick={installApp}
                        >
                            Установить как приложение
                        </button>
                    )}
                </div>
            )
        );
    }
}

export default withInstallPwaApp(Login);
