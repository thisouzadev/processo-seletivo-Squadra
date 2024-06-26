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
import Image from 'next/image'
import favicon from '../../public/favicon/favicon.png'

const Header: React.FC = () => {
  const { toggleTheme, theme } = useThemeContext()

  return (
    <AppBar position="static" sx={{ marginBottom: '2rem' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Image src={favicon} width={30} height={30} alt="pokebola" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pokédex
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, marginLeft: 'auto' }}>
          <Link href="/" passHref>
            <Button color="inherit">Pokémon</Button>
          </Link>
          <Link href="/favoritos" passHref>
            <Button color="inherit">Favorites</Button>
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
