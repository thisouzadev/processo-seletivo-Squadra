import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardHeader, Button, Typography, Box, CardActions, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { PokemonDetail } from '../../pokemon/interfaces/PokemonDetail';
import { Favorite } from '@mui/icons-material';
import { addPokemonToFavorites, removePokemonFromFavorites, readFavoritePokemonIds, updateFavoritePokemons } from '../../pokemon/services/favoritePokemon';

const typeColors: { [key: string]: string } = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

interface PokedexCardProps {
  pokemon: PokemonDetail;
}

const PokedexCard: React.FC<PokedexCardProps> = ({ pokemon }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false); 
  useEffect(() => {
    const favoritePokemonIds = readFavoritePokemonIds();
    setIsFavorite(favoritePokemonIds.includes(pokemon.id));
  }, [pokemon.id]); 

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const color = typeColors[pokemon.types[0].type.name];
  
  const handleFavoriteToggle = () => {
    console.log(pokemon);
    updateFavoritePokemons(pokemon.id, !isFavorite);
    setIsFavorite(!isFavorite);
  };

  const hasWeaknesses = pokemon.weaknesses && pokemon.weaknesses.length > 0;
  const hasStrengths = pokemon.strengths && pokemon.strengths.length > 0;
  const hasWeaknessesOrStrengths = hasWeaknesses || hasStrengths;
  return (
    <Card style={{ backgroundColor: color, color: '#FFF' }}>
      <Box display="flex" >
      <CardMedia
        component="img"
        alt={pokemon.name}
        height="140"
        image={pokemon.sprites.front_default}
        title={pokemon.name}
      />
      <CardActions disableSpacing>
          <IconButton onClick={handleFavoriteToggle} aria-label="add to favorites">
            <Favorite color={isFavorite ? 'error' : 'disabled'} />
          </IconButton>
      </CardActions>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        <CardHeader
          title={pokemon.name}
          subheader={pokemon.types.map((type) => type.type.name).join(', ')}
        />
        
          {hasWeaknessesOrStrengths && (
        <Button variant="outlined" onClick={toggleVisibility}>
          {isVisible ? 'Esconder informações' : 'Fraqueza / Força'}
        </Button>
      )}
        <div style={{ display: 'flex' }}>
          <Box display={isVisible ? 'block' : 'none'} py={2}>
            <Typography variant="h6">Fraqueza</Typography>
            <ul>
              {pokemon.weaknesses &&
                pokemon.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
            </ul>
          </Box>
          <Box display={isVisible ? 'block' : 'none'} py={2}>
            <Typography variant="h6">Força</Typography>
            <ul>
              {pokemon.strengths &&
                pokemon.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
            </ul>
          </Box>
        </div>
      </Box>
    </Card>
  );
};

export default PokedexCard;
