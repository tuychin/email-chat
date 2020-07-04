import React, { Component } from 'react';
import { sendConfirmEmail, signInWithGoogle, signInWithGitHub } from '../../helpers/auth';

import Confirm from '../../components/Confirm';

import './login.scss';

const Bevis = require('bevis');

const block = new Bevis('login');

export default class Login extends Component {
    state = {
        error: null,
        email: '',
        showConfirm: false,
    };

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
            error,
        } = this.state;

        return (
            showConfirm ? <Confirm email={email} /> : (
                <div className={block.name()}>
                    <form onSubmit={this.handleSubmit}>
                        <h1>Добро пожаловать в Email-chat</h1>
                        <p>Всё что вам нужно, чтобы начать - электронная почта!</p>
    
                        <div>
                            <input
                                placeholder="Email"
                                name="email"
                                type="email"
                                onChange={this.handleChange}
                                value={email}
                            />
                        </div>
    
                        <div>
                            {error ? (<p>{error}</p>) : null}
                            <button type="submit">Войти</button>
    
                            <p>Для входа вы можете использовать эти сервисы:</p>
    
                            <button onClick={this.googleSignIn} type="button">Войти с Google</button>
                            <button type="button" onClick={this.githubSignIn}>Войти с GitHub</button>
                        </div>
                    </form>
                </div>
            )
        );
    }
}
