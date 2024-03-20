import { AppBar, Toolbar, IconButton, Typography, Container, Grid } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { PokemonDetail } from '../../pokemon/interfaces/PokemonDetail';
import { readFavoritePokemonIds, updateFavoritePokemons } from '../pokemon/services/favoritePokemon';
import PokedexCard from '../pokedex/components/PokedexCard';

interface FavoritePokemonsProps {}

export const FavoritePokemons: React.FC<FavoritePokemonsProps> = () => {
  const [favoritePokemons, setFavoritePokemons] = useState<PokemonDetail[]>([]);

  useEffect(() => {
    const fetchFavoritePokemons = async () => {
      const favoritePokemonIds = readFavoritePokemonIds();
      const promises = favoritePokemonIds.map((pokemonId: any) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
          .then((response) => response.json())
      );
      const favoritePokemonDetails = await Promise.all(promises);
      setFavoritePokemons(favoritePokemonDetails);
    };

    fetchFavoritePokemons();
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" size="large">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Favoritos</Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <div style={{ marginTop: `1em` }}>
          <Grid container spacing={2}>
            {favoritePokemons.map((pokemon) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
                <PokedexCard pokemon={pokemon} />
              </Grid>
            ))}
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default FavoritePokemons;
