import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import UnoptimizedImage from './UnoptimizedImage'
import { Pokemon } from '../types'
import { IconButton } from '@mui/material'
import { Favorite } from '@mui/icons-material'
import {
  addPokemonToFavorites,
  readFavoritePokemonIds,
  removePokemonFromFavorites,
} from '@/services/favoritePokemon'
import { typeColors } from '@/styles/typeColor'

interface PokemonCardProps {
  pokemon: Pokemon
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false)

  const updateFavoritePokemons = (
    pokemonId: number,
    isFavorite: boolean,
  ): void =>
    isFavorite
      ? addPokemonToFavorites(pokemonId)
      : removePokemonFromFavorites(pokemonId)

  useEffect(() => {
    const favoritePokemonIds = readFavoritePokemonIds()
    if (pokemon.id !== undefined) {
      setIsFavorite(favoritePokemonIds.includes(pokemon.id))
    }
  }, [pokemon.id])

  const handleFavoriteToggle = () => {
    if (pokemon.id !== undefined) {
      updateFavoritePokemons(pokemon.id, !isFavorite)
    }
    setIsFavorite(!isFavorite)
  }

  const color = typeColors[pokemon.details!.types[0]]

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          backgroundColor: color,
          color: '#FFF',
          borderRadius: 2,
          boxShadow: 3,
          padding: 2,
          position: 'relative',
        }}
      >
        {pokemon.details && (
          <>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {pokemon.name}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                #{pokemon.id}
              </Typography>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <UnoptimizedImage
                  src={
                    pokemon.details.sprites.versions['generation-v'][
                      'black-white'
                    ].animated.front_default ||
                    pokemon.details.sprites.front_default ||
                    '/placeholder.png'
                  }
                  alt={`${pokemon.name} sprite`}
                  width={100}
                  height={100}
                  style={{
                    transform: 'rotate(360deg)',
                    transition: 'transform .7s ease-in-out',
                  }}
                  onMouseOver={(e: React.MouseEvent<HTMLImageElement>) =>
                    (e.currentTarget.style.transform = 'rotate(360deg)')
                  }
                  onMouseOut={(e: React.MouseEvent<HTMLImageElement>) =>
                    (e.currentTarget.style.transform = 'rotate(0deg)')
                  }
                />
              </div>
              <IconButton
                onClick={handleFavoriteToggle}
                aria-label="add to favorites"
                sx={{
                  color: isFavorite ? 'error.main' : 'action.disabled',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
              >
                <Favorite />
              </IconButton>
            </CardContent>
            <CardContent>
              <Typography gutterBottom variant="h6">
                Type: {pokemon.details.types.join(', ')}
              </Typography>
              <Typography gutterBottom variant="h6">
                Weaknesses:{' '}
                {pokemon?.details.weaknesses
                  ? pokemon.details.weaknesses.join(', ')
                  : 'Nenhuma fraqueza conhecida'}
              </Typography>
            </CardContent>
          </>
        )}
      </Card>
    </Grid>
  )
}

export default PokemonCard
