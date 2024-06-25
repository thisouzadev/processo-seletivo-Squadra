import React, { useState } from 'react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { useForm, Controller } from 'react-hook-form'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import PokemonCard from '@/components/PokemonCard'
import { Pokemon, PokemonType, Sprites } from '../types'
import PokemonNaoEncontrado from '@/components/PokemonNaoEncontrado'

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
] as const

type PokemonTypeDetails = (typeof POKEMON_TYPES)[number]
export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await axios.get(
      'https://pokeapi.co/api/v2/pokemon?limit=1000',
    )
    const pokemonList: Pokemon[] = await limitedPromiseAll(
      response.data.results.map((pokemon: { name: string; url: string }) => ({
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

export const limitedPromiseAll = async (
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
          const types: string[] = detailsResponse.data.types.map(
            (type: PokemonType) => type.type.name,
          )
          const weaknessesResponse = await axios.get(
            `https://pokeapi.co/api/v2/type/${types[0]}/`,
          )
          const weaknesses: string[] =
            weaknessesResponse.data.damage_relations.double_damage_from.map(
              (weakness: { name: string }) => weakness.name,
            )
          const id: number = detailsResponse.data.id
          const sprites: Sprites = detailsResponse.data.sprites
          const animatedFrontDefault: string | null =
            sprites.versions['generation-v']['black-white'].animated
              .front_default

          return {
            name: pokemon.name,
            url: pokemon.url,
            id,
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
  const [visiblePokemon, setVisiblePokemon] = useState(10)
  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      name: '',
      types: POKEMON_TYPES.reduce(
        (acc, type) => ({ ...acc, [type]: false }),
        {} as Record<PokemonTypeDetails, boolean>,
      ),
      weaknesses: POKEMON_TYPES.reduce(
        (acc, type) => ({ ...acc, [type]: false }),
        {} as Record<PokemonTypeDetails, boolean>,
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
    const typesMatch: boolean = Object.keys(filters.types).every(
      (type) =>
        !filters.types[type as keyof (typeof filters)['types']] ||
        (pokemon.details && pokemon.details.types?.includes(type))!,
    )
    const weaknessesMatch: boolean = Object.keys(filters.weaknesses).every(
      (type) =>
        !filters.weaknesses[type as keyof (typeof filters)['weaknesses']] ||
        (pokemon.details && pokemon.details.weaknesses?.includes(type))!,
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
                    name={`types.${type}` as const}
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} checked={Boolean(field.value)} />
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
                    name={`weaknesses.${type}` as const}
                    control={control}
                    render={({ field }) => (
                      <Checkbox {...field} checked={Boolean(field.value)} />
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
        {filteredPokemonList.length === 0 ? (
          <PokemonNaoEncontrado />
        ) : (
          filteredPokemonList
            .slice(0, visiblePokemon)
            .map((pokemon, index) => (
              <PokemonCard key={index} pokemon={pokemon} />
            ))
        )}
      </Grid>
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {visiblePokemon < filteredPokemonList.length && (
          <Button variant="contained" color="primary" onClick={handleLoadMore}>
            Buscar Mais
          </Button>
        )}
      </div>
    </Container>
  )
}

export default Home
