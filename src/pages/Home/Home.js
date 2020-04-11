import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './home.css';

class Home extends Component {
    render() {
        return (
            <div>
                <h1>Welcome to Email-chat!</h1>
                <h2>
                    <Link to="/login">Login to your account</Link>
                </h2>
            </div>
        );
    }
}

export default Home;