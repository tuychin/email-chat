import React, { PureComponent } from 'react';
import Bevis from 'bevis';
import { sendConfirmEmail, signInWithGoogle, signInWithGitHub } from '../../helpers/auth';

import Confirm from '../../components/Confirm';

import './login.scss';

const block = new Bevis('login');

export default class Login extends PureComponent {
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

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = async (event) => {
        const {email} = this.state;

        event.preventDefault();
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
                </div>
            )
        );
    }
}
