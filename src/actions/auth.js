import database, { auth } from '../firebase/firebase';
import { startGetPractitioner } from './practitioner.js';
import { saveSession } from '../actions/session'

export const loginAction = ({ uid } = {}) => ({
    type: 'LOGIN',
    uid
});

export const startLogout = () => {
    return (dispatch) => {
        return auth.signOut();
    }
}

export const startLogin = (token, session) => {
    return (dispatch) => {

        const user = session.user;

        const userToAdd = {
            uid: user.id,
            name: user.forename,
            avatar: user.avatar ? user.avatar : "",
            email: user.email ? user.email : ""
        }
        auth.signInWithCustomToken(token).then((result) => {

            database.ref(`users/${user.id}`).once('value', (snapshot) => {
                if (!snapshot.val()) {
                    database.ref(`users/${user.id}`).set(userToAdd);
                } else {
                    database.ref(`users/${user.id}`).update(userToAdd);
                }
            });
            dispatch(saveSession(session));
            dispatch(startGetPractitioner());


        }).catch(function (error) {
            var errorCode = error.code;
            if (errorCode === 'auth/invalid-custom-token') {
                alert('The token you provided is not valid.');
            } else {
                console.error(error);
            }
        });
    }

}

export const logoutAction = ({ uid } = {}) => ({
    type: "LOGOUT",
    uid
})