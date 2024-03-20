import React, { useEffect, useState } from 'react';
import {  PokemonListInterface, listPokemons } from '../pokemon/services/listPokemons';
import { getPokemonsDetails } from '../pokemon/services/getPokemonDetails';
import { PokemonDetail } from '../pokemon/interfaces/PokemonDetail';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Container, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

interface PokedexProps {
  
}

export const Pokedex: React.FC<PokedexProps> = () => {
  const [pokemons, setPokemons] = useState<PokemonListInterface[]>([])
  const [selectedPokemon, setSelectPokemon] = useState<PokemonListInterface | undefined>(undefined)
  const [selectedPokemonDetails, setSelectedPokemonDetails] = useState<PokemonDetail | undefined>(undefined)
  useEffect(() =>{
    listPokemons().then((response) => setPokemons(response.results))
  }, [])

  useEffect(() =>{
    if (!selectedPokemon) return;
    getPokemonsDetails(selectedPokemon.name)
      .then((response) => setSelectedPokemonDetails(response))
  }, [selectedPokemon])

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
            Pokedex
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>

    <Container maxWidth="lg">
        <Box component="section" mt={10}>
          <Typography variant="h5" gutterBottom>
            Pokemons:
          </Typography>
          <Grid container spacing={2}>
            {pokemons.map((pokemon) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.name}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {pokemon.name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => setSelectPokemon(pokemon)} size="small">Abrir</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h6" gutterBottom>
            Pokemon selecionado: {selectedPokemon?.name || "Nenhum pokemon selecionado"}
          </Typography>
          {JSON.stringify(selectedPokemonDetails, undefined, 2)}
        </Box>
      </Container>

    </div>
  );
};

export default Pokedex;