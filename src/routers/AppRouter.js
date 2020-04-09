import { Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory';
import React from 'react';
import LoginPage from '../components/LoginPage';
import ChatDashBoardPage from '../components/ChatDashBoardPage';
import HelpPage from '../components/HelpPage';
import NotFoundPage from '../components/NotFoundPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const history = createHistory();
const AppRouter = () => (
    <Router history={history}>
            <Switch>
                <PublicRoute path="/" component={LoginPage} exact={true} />
                <PublicRoute path="/help" component={HelpPage} />
                <PrivateRoute path="/chat" component={ChatDashBoardPage} />
                <Route component={NotFoundPage} />
            </Switch>
    </Router>
);

export default AppRouter;
