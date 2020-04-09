import React from 'react';
import { connect } from 'react-redux';
import { startLogin } from '../actions/auth'
import { login } from '../api/UserApi'
import { getFirebaseToken } from '../api/FirebaseApi'

class Form extends React.Component {

    handleLogin = (e) => {
        e.preventDefault();

        try {

            const username = e.target.elements.username.value.trim();
            const password = e.target.elements.password.value.trim();

            if (username && password) {

                e.target.elements.username.value = "";
                e.target.elements.password.value = "";

                login(username, password).then(response => {
                    getFirebaseToken(response.session).then(tokenResponse => {

                        this.props.startLogin(tokenResponse.token, response.session);
                    })
                }).catch((error) => {
                    console.log(error)
                    alert(error.error.message);
                });
            }
        } catch (exception) {
            console.log(exception.message);
        }
    }

    render() {
        return (
            <div className='login-form'>
                <form onSubmit={this.handleLogin}>
                    Username <input type="text" name="username"></input><br />
                    Password <input type="password" name="password"></input><br />
                    <button>Login</button>
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    startLogin: (token, session) => dispatch(startLogin(token, session))
});

export default connect(undefined, mapDispatchToProps)(Form);
