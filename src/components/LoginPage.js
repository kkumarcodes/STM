import React from 'react';
import { connect } from 'react-redux';
import { startLogin } from '../actions/auth'
import { login } from '../api/UserApi'
import { getFirebaseToken } from '../api/FirebaseApi'
import home from '../assets/images/home.jpeg'
class LoginPage extends React.Component {

    state = {
        username: '',
        password: '',
        error: '',
        isError: false,
        isload: false
    }

    componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
    }

    escFunction = (event) => {
        if(event.key === 'Enter') {
            this.handleLogin()
        }
      }

    handleOnChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleLogin = () => {
        try {
            const {
                username,
                password
            } = this.state

            let error

            if (username === ''){
                error = 'Please fill out username.'
            } else if (password === ''){
                error = 'Please fill out password.'
            }

            this.setState({
                error: error,
                isError: true
            })

            if (username && password) {

                this.setState({
                    isError: false,
                    isload: true
                })

                const log = login(username, password)
                    .then(response => {
                        console.log("logiiiiig")
                        getFirebaseToken(response.session)
                            .then(tokenResponse => {
                                this.props.startLogin(tokenResponse.token, tokenResponse.session);
                            }
                        )
                    })
                    .catch(reject=>{
                        this.setState({
                            error: "The username and password don’t match.",
                            isError: true,
                            isload: false
                        })
                    })
                
            }
        } catch (exception) {
            console.log("or eeror?")
            console.log(exception.message);
        }
    }

    render() {
        
        const {
            username,
            password,
            error,
            isError,
            isload
        } = this.state

        return (
            <div className='form-container'>
                <div className="login-form animated bounceInRight">
                    <div className="introduce-pic"><img src={home}/></div>
                    <div className="right-form">
                        <div className="form-wrap">
                            <div className="login-title"><span>S</span>TM Login</div>
                            <hr/>
                            <label>Username</label> 
                            <input type="text" name="username" value={username} onChange={this.handleOnChange}></input>
                            <label>Password</label>
                            <input type="password" name="password" value={password} onChange={this.handleOnChange}></input>
                            <label className={`error ${isError && 'show-error'}`}>{error}</label>
                            <button onClick={this.handleLogin}>
                               {isload?
                                 (<div className="loader">
                                    <span>
                                        <i></i>
                                        <i></i>
                                        <i></i>
                                        <i></i>
                                    </span>
                                </div>):
                                <span>Login</span>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    startLogin: (token, session) => dispatch(startLogin(token, session))
});

export default connect(undefined, mapDispatchToProps) (LoginPage);
