import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import {
    AppBar,
    TextField,
    Button,
    Link,
    Typography,
    Toolbar,
  } from '@mui/material';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import Header from '../components/Header';
const SIGNIN_URL = '/auth/signin';

const Signin = () => {
  const { setAuth } = useAuth();
  const [errMsg, setErrMsg] = useState('');
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

    const submit = async (data) => {
      try {
        const response = await axios.post(SIGNIN_URL,
            JSON.stringify(data),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        console.log(JSON.stringify(response?.data));
        //console.log(JSON.stringify(response));
        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        setAuth({ roles, accessToken, isAuth: true });
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
      <Header title="signin" />

      <form style={{marginTop:100}} onSubmit={handleSubmit(submit)}>
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
        {errMsg && <Typography color="red">{errMsg}</Typography>}
        <Button type='submit' variant="contained" color="primary">
          signin
        </Button>
      </form>
      <Link href="/#/signup">Ou signup</Link> or go back <Link href="/">home</Link>
    </div>
  )
}

export default Signin