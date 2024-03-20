// Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useThemeContext } from '../ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static"  sx={{ backgroundColor: theme === 'light' ? '#fff' : '#333' }}>
        <Toolbar>
          <Typography variant="h6" component={Link} to={`/`} sx={{ flexGrow: 1 }}>
            Pokedex
          </Typography>
          <Typography variant="h6" component={Link} to={`/favoritos`} sx={{ flexGrow: 1 }}>
            Favoritos
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {theme === 'light' ? '🌞' : '🌙'}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
