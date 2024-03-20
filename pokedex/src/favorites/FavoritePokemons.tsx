import { Container, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { readFavoritePokemonIds } from '../pokemon/services/favoritePokemon';
import PokedexCard from '../pokedex/components/PokedexCard';
import Header from '../components/Header';
import { PokemonDetail } from '../pokemon/interfaces/PokemonDetail';
import { useThemeContext } from '../ThemeContext';

interface FavoritePokemonsProps {}

export const FavoritePokemons: React.FC<FavoritePokemonsProps> = () => {
  const { theme } = useThemeContext();
  const [favoritePokemons, setFavoritePokemons] = useState<PokemonDetail[]>([]);

  useEffect(() => {
    const fetchFavoritePokemons = async () => {
      const favoritePokemonIds = readFavoritePokemonIds();
      const promises = favoritePokemonIds.map((pokemonId) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
          .then((response) => response.json())
      );
      const favoritePokemonDetails = await Promise.all(promises);
      setFavoritePokemons(favoritePokemonDetails);
    };

    fetchFavoritePokemons();
  }, []);

  return (
    <div style={{ paddingBottom:'100%',  backgroundColor: theme === 'light' ? '#fff' : '#333' }}>
      <Header />
      <Container >
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
