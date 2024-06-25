import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import UnoptimizedImage from './UnoptimizedImage'
import { Pokemon } from '../pages/types'

interface PokemonCardProps {
  pokemon: Pokemon
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        {pokemon.details && (
          <>
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
