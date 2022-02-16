import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import axios from 'axios';
import {authenticate, isAuth} from './helpers';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Google from './Google';
import Facebook from './Facebook';




const Signin = ({history}) => {
    const [values, setValues] = useState({
        email: 'achillesgaming06@gmail.com',
        password: 'bbbbbb',
        buttonText: 'Submit'
    })

    const {email, password, buttonText} = values;


    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    }

    const informParent = response => {
        authenticate(response, () => {
            isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private');
        })
    }

    const clickSubmit = event => {
        event.preventDefault();
        setValues({...values, buttonText: 'Submitting'});
        axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API}/signin`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {email, password}
        })
        .then(response => {
            console.log(`Sign in Success!`, response);

            // save the token in local storage / cookies
            authenticate(response, () => {
                setValues({...values, name: '', email: '', password: '', buttonText: 'Submitted'});
                // toast.success(`Welcome ${response.data.user.name}!`); 
                isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private');
            })
        })
        .catch(error => {
            console.log(`Sign in Error!`, error.response.data.error)
            setValues({...values, buttonText: 'Submit'});
            toast.error(error.response.data.error);
        })
    }

    const signinForm = () => (
        <form>
            <div className="form-group">
                <label className='text-muted'>Email</label>
                <input type="email" className="form-control" value={email} onChange={handleChange('email')} />
            </div>

            <div className="form-group">
                <label className='text-muted'>Password</label>
                <input type="password" className="form-control" value={password} onChange={handleChange('password')} />
            </div>

            <div>
                <button className="btn btn-primary" disabled={buttonText === 'Submitted'} onClick={clickSubmit}>{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                {isAuth() ? <Redirect to="/" /> : null}
                <h1 className='p-5 text-center'>Signin</h1>
                <Google informParent={informParent}/>
                <Facebook informParent={informParent}/>
                {signinForm()}
                <br/>
                <Link to='/auth/password/forgot' className='btn btn-sm btn-outline-danger'>
                    Forgot Password?
                </Link>
            </div>
        </Layout>
    );
}


export default Signin;
