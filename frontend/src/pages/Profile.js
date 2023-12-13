import React from 'react';
import {
    AppBar,
    Button,
    Link,
    Typography,
  } from '@mui/material';


const Profile = () => {
    const name = localStorage.getItem("name")
  return (
    <div className="App">
      <AppBar >
        <toolbar>
          <h1>PROFILE</h1>
        </toolbar>
      </AppBar>

      <div style={{marginTop:100}}>
        <Typography>
            welcome {name}
        </Typography>
        <Button variant="contained" color="warning">
          logout
        </Button>
      </div>
      <Link href="/">home</Link>
    </div>
  )
}

export default Profile