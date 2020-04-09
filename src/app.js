// import substract, { multiply, add } from "./utils.js"
import validator from 'validator';
import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter, { history } from './routers/AppRouter';
import './styles/styles.scss';
import 'normalize.css/normalize.css';
import configureStore from './store/configureStore';
import { Provider } from 'react-redux';
import { loginAction, logoutAction } from './actions/auth';
import './firebase/firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from './firebase/firebase';
const store = configureStore().store;

let hasRendered = false;

store.subscribe(() => {
    console.log("This is store state", store.getState())
})

const renderApp = () => {

    if (!hasRendered) {

        ReactDOM.render(jsx, document.getElementById('app'));
        hasRendered = true;
    }
}

const jsx = (
    <Provider store={store}><AppRouter /></Provider>
);

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("USERER", user)
        renderApp();
        store.dispatch(loginAction({ uid: user.uid }));

        if (history.location.pathname === '/') {
            history.push('/chat');
        }
    } else {
        renderApp();
        store.dispatch(logoutAction());
        history.push("/")
    }
})

