import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import UnoptimizedImage from './UnoptimizedImage'
import { Pokemon } from '../pages/types'
import { IconButton } from '@mui/material'
import { Favorite } from '@mui/icons-material'

interface PokemonCardProps {
  pokemon: Pokemon
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const readFavoritePokemonIds = (): number[] => {
    const favoritePokemonIdsJson = localStorage.getItem('favoritePokemonIds')
    return favoritePokemonIdsJson ? JSON.parse(favoritePokemonIdsJson) : []
  }

  const saveFavoritePokemons = (pokemons: number[]): void => {
    localStorage.setItem('favoritePokemonIds', JSON.stringify(pokemons))
  }

  const addPokemonToFavorites = (pokemonId: number): void => {
    const favoritePokemons = readFavoritePokemonIds()
    const newFavoritePokemons = [...favoritePokemons, pokemonId]

    saveFavoritePokemons(newFavoritePokemons)
  }

  const removePokemonFromFavorites = (pokemonId: number): void => {
    const favoritePokemons = readFavoritePokemonIds()
    const newFavoritePokemons = favoritePokemons.filter(
      (id) => id !== pokemonId,
    )

    saveFavoritePokemons(newFavoritePokemons)
  }

  const updateFavoritePokemons = (
    pokemonId: number,
    isFavorite: boolean,
  ): void =>
    isFavorite
      ? addPokemonToFavorites(pokemonId)
      : removePokemonFromFavorites(pokemonId)

  useEffect(() => {
    const favoritePokemonIds = readFavoritePokemonIds()
    setIsFavorite(favoritePokemonIds.includes(pokemon.id))
  }, [pokemon.id])

  const handleFavoriteToggle = () => {
    updateFavoritePokemons(pokemon.id, !isFavorite)
    setIsFavorite(!isFavorite)
  }
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        {pokemon.details && (
          <>
            <IconButton
              onClick={handleFavoriteToggle}
              aria-label="add to favorites"
            >
              <Favorite color={isFavorite ? 'error' : 'disabled'} />
            </IconButton>
            <UnoptimizedImage
              src={
                pokemon.details.sprites.versions['generation-v']['black-white']
                  .animated.front_default ||
                pokemon.details.sprites.front_default ||
                '/placeholder.png'
              }
              alt={`${pokemon.name} sprite`}
              width={100}
              height={100}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {pokemon.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Tipo: {pokemon.details.types.join(', ')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Fraqueza: {pokemon.details.weaknesses.join(', ')}
              </Typography>
            </CardContent>
          </>
        )}
      </Card>
    </Grid>
  )
}

export default PokemonCard
