import React from 'react';
import PropTypes from 'prop-types';

import {
    Route,
    Redirect,
} from 'react-router-dom';

export default function PublicRoute({ component: Component, authenticated, ...rest }) {
    return (
        <Route
            {...rest}
                render={(props) => authenticated ?
                    <Redirect to="/chat" /> :
                    <Component {...props} />}
        />
    )
}

PublicRoute.propTypes = {
    component: PropTypes.func,
    authenticated: PropTypes.bool,
}
