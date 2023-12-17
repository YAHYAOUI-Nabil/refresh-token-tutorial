import { AppBar, Toolbar } from '@mui/material'
import React from 'react'

const Header = ({title, children}) => {
  return (
    <AppBar position='relative'>
        <Toolbar style={{justifyContent: "space-between"}}>
          <h1 style={{textTransform: "uppercase"}}>{title}</h1>
          {children}
        </Toolbar>
      </AppBar>
  )
}

export default Header