import React, { PureComponent } from 'react';
import Bevis from 'bevis';
import { sendConfirmEmail, signInWithGoogle, signInWithGitHub } from '../../utils/auth';

import Confirm from '../../components/Confirm';

import './login.scss';

const block = new Bevis('login');

class Login extends PureComponent {
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

        evt.preventDefault();
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
                    <div className={`${block.elem('title')} text-center`}>
                        <h1>Всё что вам нужно, чтобы начать общение - электронная почта!</h1>
                        <p>
                            Это некомерческий, личный проект. Автор проекта не отвечает за конфиденциальность данных, которые вы можете оставить на этом сайте.
                        </p>
                        <p>
                            Автор: <a href="https://github.com/tuychin">Туйчин Равиль</a>
                        </p>
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

export default Login;
