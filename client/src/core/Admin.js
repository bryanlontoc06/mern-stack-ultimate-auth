import React, {useState, useEffect} from 'react';
import {Link, Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import axios from 'axios';
import { isAuth, getCookie, signout, updateUser } from '../auth/helpers';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


const Admin = ({history}) => {
    const [values, setValues] = useState({
        role: '',
        name: '',
        email: '',
        password: '',
        buttonText: 'Submit'
    })

    const { role, name, email, password, buttonText} = values;

    const token = getCookie('token');

    useEffect(() => {
        loadProfile();
    }, [])

    const loadProfile = () => {
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            // console.log(`Private Profile loaded: ${JSON.stringify(response.data)}`);
            const {role, name, email} = response.data;
            setValues({...values, role, name, email});
        })
        .catch(error => {
            console.log(`Private Error loading profile: ${error}`);
            if(error.response.status === 401) {
                signout(() => {
                    history.push('/')
                })
            }
        })
    }

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    }

    const clickSubmit = event => {
        event.preventDefault();
        setValues({...values, buttonText: 'Submitting'});
        axios({
            method: 'PUT',
            url: `${process.env.REACT_APP_API}/admin/update`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`
            },
            data: {name, password}
        })
        .then(response => {
            console.log(`Private profile update Success!`, response);
            updateUser(response, () => {
                setValues({...values, buttonText: 'Submitted'});
                toast.success('Profile updated successfully!')
            });
        })
        .catch(error => {
            console.log(`Profile private update Error!`, error.response.data.error)
            setValues({...values, buttonText: 'Submit'});
            toast.error(error.response.data.error);
        })
    }

    const updateForm = () => (
        <form>
            <div className="form-group">
                <label className='text-muted'>Role</label>
                <input type="text" className="form-control" disabled defaultValue={role} />
            </div>

            <div className="form-group">
                <label className='text-muted'>Name</label>
                <input type="text" className="form-control" value={name} onChange={handleChange('name')} />
            </div>

            <div className="form-group">
                <label className='text-muted'>Email</label>
                <input type="email" className="form-control" disabled defaultValue={email} />
            </div>

            <div className="form-group">
                <label className='text-muted'>Password</label>
                <input type="password" className="form-control" value={password} onChange={handleChange('password')} />
            </div>

            <div>
                <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                <h1 className='pt-5 text-center'>Admin</h1>
                <p className='lead text-center'>Profile Update</p>
                {updateForm()}
            </div>
        </Layout>
    );
}
export default Admin;


