import React from 'react';
import { useForm } from 'react-hook-form';
import {
    AppBar,
    TextField,
    Button,
    Link,
  } from '@mui/material';

const Signin = () => {
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
          <h1>SIGNIN FORM </h1>
        </toolbar>
      </AppBar>

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
        <Button type='submit' variant="contained" color="primary">
          signin
        </Button>
      </form>
      <Link href="/#/signup">Ou signup</Link> or go back <Link href="/">home</Link>
    </div>
  )
}

export default Signin