import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Meu Pokédex
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link href="/" passHref>
            <Button color="inherit">Pokémon</Button>
          </Link>
          <Link href="/favoritos" passHref>
            <Button color="inherit">Favoritos</Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
