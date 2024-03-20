import React, { useEffect, useState } from 'react';
import { getPokemonsDetails } from './services/getPokemonDetails';
import { PokemonDetail } from './interfaces/PokemonDetail';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';


interface PokemonDetailsProps {
  
}

export const PokemonDetails: React.FC<PokemonDetailsProps> = () => {
  const { name }= useParams()
  // const [selectedPokemon, setSelectPokemon] = useState<PokemonListInterface | undefined>(undefined)
  const [selectedPokemonDetails, setSelectedPokemonDetails] = useState<PokemonDetail | undefined>(undefined)

  useEffect(() =>{
    if (!name) return;
    getPokemonsDetails(name)
      .then((response) => setSelectedPokemonDetails(response))
  }, [name])
  return (
    <div>
                <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
    <img src={selectedPokemonDetails?.sprites.front_default} alt="" />
    </div>
  );
};

export default PokemonDetails;