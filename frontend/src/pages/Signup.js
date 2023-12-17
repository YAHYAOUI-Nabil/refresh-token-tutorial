import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    AppBar,
    TextField,
    Button,
    Link,
    Typography,
    Toolbar,
  } from '@mui/material';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
const SIGNUP_URL = '/user';


const Signup = () => {
  const { setAuth } = useAuth();
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

    const submit = async (data) => {
      const formData = {
        username: data.firstname + ' ' + data.lastname,
        email: data.email,
        password: data.password,
        roles: data.roles.split(',')
      }
      try {
        const response = await axios.post(SIGNUP_URL,
            JSON.stringify(formData),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        console.log(JSON.stringify(response?.data));
        //console.log(JSON.stringify(response));
        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        setAuth({ roles, accessToken });
        setErrMsg('');
        navigate(from, { replace: true });
    } catch (err) {
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
            setErrMsg('Missing Username or Password');
        } else if (err.response?.status === 401) {
            setErrMsg('Unauthorized');
        } else {
            setErrMsg('Login Failed');
        }
        // errRef.current.focus();
    }
    }
  return (
    <div className="App">
      <Header title="signup" />

      <form style={{marginTop:100}} onSubmit={handleSubmit(submit)}>
        <TextField
          style={{ width: "300px", margin: "5px" }}
          type="text"
          id="firstname"
          label="FirstName"
          variant="outlined"
          {...register('firstname', { required: true })}
        />
        <br />
        <TextField
          style={{ width: "300px", margin: "5px" }}
          type="text"
          id="lastname"
          label="LastName"
          variant="outlined"
          {...register('lastname', { required: true })}
        />
        <br />
        <TextField
          style={{ width: "300px", margin: "5px" }}
          type="email"
          id="email"
          label="Email"
          variant="outlined"
          {...register('email', { required: true })}
        />
        <br />
        <TextField
          style={{ width: "300px", margin: "5px" }}
          type="password"
          id="password"
          label="Password"
          variant="outlined"
          {...register('password', { required: true })}
        />
        <br />
        <TextField
          style={{ width: "300px", margin: "5px" }}
          type="text"
          id="roles"
          label="Roles"
          variant="outlined"
          {...register('roles', { required: true })}
        />
        <br />
        {errMsg && <Typography color="red">{errMsg}</Typography>}
        <Button type='submit' variant="contained" color="primary">
          signup
        </Button>
      </form>
      <Link href="/#/signin">Ou signin</Link> or go back <Link href="/">home</Link>
    </div>
  )
}

export default Signup


