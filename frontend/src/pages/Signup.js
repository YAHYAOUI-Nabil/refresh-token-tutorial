import React from 'react';
import { useForm } from 'react-hook-form';
import {
    AppBar,
    TextField,
    Button,
    Link,
  } from '@mui/material';

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

    const submit = (data) => {
        console.log(data)
    }
  return (
    <div className="App">
      <AppBar >
        <toolbar>
          <h1>SIGNUP FORM </h1>
        </toolbar>
      </AppBar>

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
        <Button type='submit' variant="contained" color="primary">
          signup
        </Button>
      </form>
      <Link href="/#/signin">Ou signin</Link> or go back <Link href="/">home</Link>
    </div>
  )
}

export default Signup


