import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import axios from 'axios';

const Facebook = ({informParent = f => f}) => {

    const responseFacebook = (response) => {
        console.log(`Facebook Response!`, response);
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/facebook-login`,
            data: {userID: response.userID, accessToken: response.accessToken}
        })
        .then(response => {
            console.log(`Facebook Login Success!`, response);
            // inform parent component that the user is authenticated
            informParent(response);
        })
        .catch(error => {
            console.log(`Facebook Login Error!`, error.response)
        })
    }

    return (
    <div className='pb-3'>
        <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            callback={responseFacebook}
            render={renderProps => (
                <button onClick={renderProps.onClick} className="btn btn-primary btn-lg btn-block"><i className='fab fa-facebook pr-2'></i>Login with Facebook</button>
              )}
        />
    </div>
 )
}

export default Facebook;