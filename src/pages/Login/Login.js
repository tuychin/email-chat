import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { confirmEmail, signInWithGoogle, signInWithGitHub } from '../../helpers/auth';

import Confirm from '../../components/Confirm';

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
        this.setState({ error: '' });

        try {
            await confirmEmail(email);
            this.setState({ showConfirm: true });
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    googleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    githubSignIn = async () => {
        try {
            await signInWithGitHub();
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    render() {
        const {showConfirm, email} = this.state;

        return (
            showConfirm ? <Confirm email={email} /> : (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <h1> Login to <Link to="/"> Email-chat </Link></h1>
                        <p>Fill in the form below to login to your account.</p>
    
                        <div>
                            <input
                                placeholder="Email"
                                name="email"
                                type="email"
                                onChange={this.handleChange}
                                value={this.state.email}
                            />
                        </div>
    
                        <div>
                            {this.state.error ? (<p>{this.state.error}</p>) : null}
                            <button type="submit">Login</button>
    
                            <p>You can also login with any of these services</p>
    
                            <button onClick={this.googleSignIn} type="button">Login with Google</button>
                            <button type="button" onClick={this.githubSignIn}>Login with GitHub</button>
                        </div>
                    </form>
                </div>
            )
        );
    }
}
