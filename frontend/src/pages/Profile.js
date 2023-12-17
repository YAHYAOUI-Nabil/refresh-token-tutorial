import React, { useEffect, useRef, useState } from 'react';
import {
    AppBar,
    Link,
    TextField,
    Button,
    Typography,
    Toolbar,
  } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form';

import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Header from '../components/Header';
const NOTES_URL = '/notes';


const Profile = () => {
  const axiosPrivate = useAxiosPrivate()
  const name = "Nabil Yahyaoui"
  const { auth, setAuth } = useAuth();
  const [errMsg, setErrMsg] = useState('');
  const [notes, setNotes] = useState([]);
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

    useEffect(() => {
      const fetchNote = async () => {
        try {
          const response = await axiosPrivate.get(NOTES_URL)
          console.log(response)
          setNotes(response.data)
        } catch (err) {
          console.log(err.response.data.message)
      }
      }
      fetchNote()
    }, [])
    

    const submit = async (data) => {
      try {
        const response = await axiosPrivate.post(NOTES_URL,
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
      <Header title="profile">
        <Typography>
          welcome {name}
        </Typography>
        <Button variant="contained" color="error">
          logout
        </Button>
      </Header>

      <div style={{marginTop: 50}}>
        <Typography variant='h6'>Create a new Note</Typography>
        <form onSubmit={handleSubmit(submit)}>
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="text"
            id="title"
            label="Title"
            variant="outlined"
            {...register('title', { required: true })}
          />
          <br />
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="text"
            id="text"
            label="Text"
            variant="outlined"
            {...register('text', { required: true })}
          />
          <br />
          {errMsg && <Typography color="red">{errMsg}</Typography>}
          <Button type='submit' variant="contained" color="primary">
            save
          </Button>
        </form>
      </div>
      <div style={{marginTop: 50}}>
        <Typography variant='h6'>My Notes</Typography>
        {
          notes?.length
          ? (
            notes?.map((note) => (
              <div key={note._id} style={{display: 'flex'}}>
                <div>
                  <Typography variant='h5'>{note.title}</Typography>
                  <Typography>{note.text}</Typography>
                </div>
                <div style={{display: 'flex'}}>
                  <Button color='primary' variant='contained'>Edit</Button>
                  <Button color='warning' variant='contained'>Delete</Button>
                </div>
              </div>
            ))
          ) : (
            <Typography>No notes to show</Typography>
          )
        }
        
      </div>
        
      <Typography>Go back <Link href="/">home</Link></Typography>
    </div>
  )
}

export default Profile