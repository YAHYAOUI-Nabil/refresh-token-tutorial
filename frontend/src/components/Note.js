import { Box, Button, Typography } from '@mui/material'
import React from 'react'

const Note = ({title, text}) => {
  return (
    <Box 
        sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "400px",
            padding: 5,
            boxShadow: 5,
            borderRadius: 1
        }}
    >
        <Box>
            <Typography variant='h5'>{title}</Typography>
            <Typography>{text}</Typography>
        </Box>
        <Box 
            sx={{
                display: 'flex', 
                justifyContent: "space-between", 
                alignItems: "flex-end",
                gap:1
            }}
        >
            <Button color='primary' variant='contained'>Edit</Button>
            <Button color='warning' variant='contained'>Delete</Button>
        </Box>
    </Box>
  )
}

export default Note