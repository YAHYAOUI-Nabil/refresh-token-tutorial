import React from 'react';
import { AppBar, Box, Container, Grid, Link, Toolbar, Typography } from '@mui/material';
import Header from '../components/Header';

const Home = () => {
  return (
    <Box className="App">
        <Header title="home" />
        <Container style={{marginTop:100}}>
            <Grid container style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop:50}}>
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Typography align='center' variant='h4'>
                        Welcome
                    </Typography>
                    <Typography>
                        This app is a tutorial to learn how to protect your application with access token and refresh token.
                    </Typography>
                    <Typography>
                        <Link href="/#/signin">Signin</Link> to visit your profile or <Link href="/#/signup">Signup</Link> to create an accout
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    </Box>
  )
}

export default Home