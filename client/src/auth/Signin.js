import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';



const Signin = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        buttonText: 'Submit'
    })

    const {email, password, buttonText} = values;


    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
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
            setValues({...values, name: '', email: '', password: '', buttonText: 'Submitted'});
            toast.success(`Hey ${response.data.user.name}, Welcome back!`);
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
            <div className="col-d-6 offset-md-3">
                <ToastContainer />
                <h1 className='p-5 text-center'>Signin</h1>
                {signinForm()}
            </div>
        </Layout>
    );
}


export default Signin;