import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'
import { useThemeContext } from '../ThemeContext'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

const Header: React.FC = () => {
  const { toggleTheme, theme } = useThemeContext()

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
          <Tooltip title="Toggle light/dark theme">
            <IconButton color="inherit" onClick={toggleTheme}>
              {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
