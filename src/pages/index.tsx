// pages/index.tsx
import React, { useState } from 'react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { useForm, Controller } from 'react-hook-form'
import UnoptimizedImage from '@/components/UnoptimizedImage'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import { Pokemon } from './types'

interface HomeProps {
  pokemonList: Pokemon[]
}

const POKEMON_TYPES = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
]

export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await axios.get(
      'https://pokeapi.co/api/v2/pokemon?limit=1000',
    )
    const pokemonList: Pokemon[] = await limitedPromiseAll(
      response.data.results.map((pokemon: any) => ({
        name: pokemon.name,
        url: pokemon.url,
      })),
    )

    return {
      props: {
        pokemonList,
      },
      revalidate: 60 * 60 * 2, // 2 hours
    }
  } catch (error) {
    console.error('Error fetching Pokémon data:', error)
    return {
      props: {
        pokemonList: [],
      },
    }
  }
}

const limitedPromiseAll = async (
  requests: { name: string; url: string }[],
  limit = 10,
): Promise<Pokemon[]> => {
  const results: Pokemon[] = []
  const batches = Math.ceil(requests.length / limit)

  for (let i = 0; i < batches; i++) {
    const batchResults = await Promise.all(
      requests.slice(i * limit, (i + 1) * limit).map(async (pokemon) => {
        try {
          const detailsResponse = await axios.get(pokemon.url)
          const types = detailsResponse.data.types.map(
            (type: string) => type.type.name,
          )
          const weaknessesResponse = await axios.get(
            `https://pokeapi.co/api/v2/type/${types[0]}/`,
          )
          const weaknesses =
            weaknessesResponse.data.damage_relations.double_damage_from.map(
              (weakness: string) => weakness.name,
            )

          const sprites = detailsResponse.data.sprites
          const animatedFrontDefault =
            sprites.versions['generation-v']['black-white'].animated
              .front_default

          return {
            name: pokemon.name,
            url: pokemon.url,
            details: {
              types,
              weaknesses,
              sprites: {
                front_default:
                  animatedFrontDefault || sprites.front_default || null,
                versions: {
                  'generation-v': {
                    'black-white': {
                      animated: {
                        front_default: animatedFrontDefault || '',
                      },
                    },
                  },
                },
              },
            },
          }
        } catch (error) {
          console.error('Error fetching Pokémon details:', error)
          return {
            name: pokemon.name,
            url: pokemon.url,
            details: null,
          }
        }
      }),
    )

    results.push(...batchResults)
  }

  return results
}

const Home: React.FC<HomeProps> = ({ pokemonList }) => {
  const [visiblePokemon, setVisiblePokemon] = useState(10) // Show 10 Pokémon initially
  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      name: '',
      types: POKEMON_TYPES.reduce(
        (acc, type) => ({ ...acc, [type]: false }),
        {},
      ),
      weaknesses: POKEMON_TYPES.reduce(
        (acc, type) => ({ ...acc, [type]: false }),
        {},
      ),
    },
  })

  const filters = watch()

  const handleLoadMore = () => {
    setVisiblePokemon((prev) => Math.min(prev + 10, pokemonList.length))
  }

  const filteredPokemonList = pokemonList.filter((pokemon) => {
    const nameMatch = pokemon.name
      .toLowerCase()
      .includes(filters.name.toLowerCase())
    const typesMatch = Object.keys(filters.types).every(
      (type) =>
        !filters.types[type] ||
        (pokemon.details && pokemon.details.types.includes(type)),
    )
    const weaknessesMatch = Object.keys(filters.weaknesses).every(
      (type) =>
        !filters.weaknesses[type] ||
        (pokemon.details && pokemon.details.weaknesses.includes(type)),
    )
    return nameMatch && typesMatch && weaknessesMatch
  })

  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Pokémon List
      </Typography>
      <form onSubmit={handleSubmit(() => {})}>
        <TextField
          label="Search by Name"
          variant="outlined"
          fullWidth
          {...register('name')}
          style={{ marginBottom: '20px' }}
        />
        <FormControl component="fieldset" style={{ marginBottom: '20px' }}>
          <Typography variant="h6">Filtro por Tipos</Typography>
          <FormGroup row>
            {POKEMON_TYPES.map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Controller
                    name={`types.${type}`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} checked={field.value} />
                    )}
                  />
                }
                label={type}
              />
            ))}
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" style={{ marginBottom: '20px' }}>
          <Typography variant="h6">Filtro por Fraquezas</Typography>
          <FormGroup row>
            {POKEMON_TYPES.map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Controller
                    name={`weaknesses.${type}`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} checked={field.value} />
                    )}
                  />
                }
                label={type}
              />
            ))}
          </FormGroup>
        </FormControl>
      </form>
      <Grid container spacing={3}>
        {filteredPokemonList.slice(0, visiblePokemon).map((pokemon, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              {pokemon.details && (
                <>
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
        ))}
      </Grid>
      {visiblePokemon < filteredPokemonList.length && (
        <Button variant="contained" color="primary" onClick={handleLoadMore}>
          Load More
        </Button>
      )}
    </Container>
  )
}

export default Home
