import React from 'react';

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
