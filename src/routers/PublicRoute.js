import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PublicRoute =
    ({

        isAuthenticated,
        component: Component,
        ...rest }) => (
            <Route {...rest} component={(props) => (

                isAuthenticated ? (
                    <Redirect to="/chat" />
                ) : (
                        <Component {...props} />
                    )
            )} />
        );

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.user.uid && !!state.session.session && state.session.session.expires > new Date().getTime()
});

export default connect(mapStateToProps)(PublicRoute);