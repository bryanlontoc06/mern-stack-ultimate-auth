import React from 'react';
import {Link, withRouter} from 'react-router-dom';



const Layout = ({ children, match }) => {

    const isActive = path => {
        if(match.path === path) {
            return {color: '#000'}
        } else {
            return {color: '#fff'}
        }
    }

    const nav = () => {
        return (<ul className='nav nav-tabs bg-primary'>
            <li className="nav-item">
                <Link className="nav-link" to="/" style={isActive(`/`)}>
                    Home
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/signin" style={isActive(`/signin`)}>
                    Signin
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/signup" style={isActive(`/signup`)}>
                    Signup
                </Link>
            </li>
        </ul>)
    }


    return (
        <>
            {nav()}
            <div className="container">{children}</div>
        </>
    );
}

export default withRouter(Layout);