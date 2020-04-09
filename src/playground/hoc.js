import React from 'react';
import ReactDOM from 'react-dom';

const Info = (props) => (
    <div>
        {props.info}
    </div>
);


const withAdminWarning = (WrappedComponent) => {
    return (props) => (
        <div>
            {!props.isAdmin && <p>This is the private info. Please do not share this</p>}
            <WrappedComponent {...props} />
        </div>
    );
};

const requireAuthentication = (WrappedComponent) => {
    return (props) => (
        <div>
            {props.isAuthenticated ? (<WrappedComponent {...props} />) : (<p>Please login to view the info</p>)}
        </div>
    );
}

const AuthInfo = requireAuthentication(Info);

const AdminInfo = withAdminWarning(Info);

//ReactDOM.render(<AdminInfo isAdmin={true} info='this is the messgae' />, document.getElementById('app'));
ReactDOM.render(<AuthInfo isAuthenticated={false} info='You have a previlege to view this content' />, document.getElementById('app'));