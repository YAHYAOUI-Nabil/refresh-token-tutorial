import React, { useEffect, useState } from 'react';
import {
    Link,
    TextField,
    Button,
    Typography,
    Box,
  } from '@mui/material';
import { useForm } from 'react-hook-form';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Header from '../components/Header';
import Note from '../components/Note';
import { useNavigate } from 'react-router-dom';
const NOTES_URL = '/notes';
const LOGOUT_URL = '/auth/logout';


const Profile = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [errMsg, setErrMsg] = useState('');
  const [sucMsg, setSucMsg] = useState('');
  const [notes, setNotes] = useState([]);
  const {
          register,
          handleSubmit,
          resetField,
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
    }, [sucMsg])
    

    const submit = async (data) => {
      try {
        const response = await axiosPrivate.post(NOTES_URL,
            JSON.stringify(data),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        setSucMsg(response?.data.message);
        resetField('title');
        resetField('text');
      } catch (err) {
        if (!err?.response) {
            setErrMsg('No Server Response');
        }  else if (err.response?.status === 401) {
            setErrMsg('Unauthorized');
        } 
      }
    }

    const logout = () => {
      axiosPrivate.post(LOGOUT_URL,
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
      );
      localStorage.clear()
      navigate('/')
    }
  return (
    <Box 
      sx={{
        display:"flex", 
        flexDirection: "column", 
        alignItems: "center"
      }}
    >

      <Header title="profile">
        <Typography>
          welcome {username}
        </Typography>
        <Button 
          variant="contained" 
          color="error"
          onClick={logout}
        >
          logout
        </Button>
      </Header>

      <Box 
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Typography variant='h6'>Create a new Note</Typography>
        <Box 
          component="form" 
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
          onSubmit={handleSubmit(submit)}
        >
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="text"
            id="title"
            label="Title"
            variant="outlined"
            {...register('title', { required: true })}
          />
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="text"
            id="text"
            label="Text"
            variant="outlined"
            {...register('text', { required: true })}
          />
          {errMsg && <Typography color="red">{errMsg}</Typography>}
          {sucMsg && <Typography color="green">{sucMsg}</Typography>}
          <Button type='submit' variant="contained" color="primary">
            save
          </Button>
        </Box>
      </Box>

      <Box 
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          marginBottom: 10,
        }}
      >
        <Typography variant='h5'>My Notes</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            padding:5,
            boxShadow: 10,
            borderRadius: 2
          }}
        >
          {
            notes?.length
            ? (
              notes?.map((note) => (
                <Note key={note._id} title={note.title} text={note.text} />
              ))
            ) : (
              <Typography>No notes to show</Typography>
            )
          }
        </Box>
      </Box> 
      <Typography 
        sx={{
          marginBottom: 10
        }}
      >Go back <Link href="/">home</Link></Typography>
    </Box>
  )
}

export default Profile