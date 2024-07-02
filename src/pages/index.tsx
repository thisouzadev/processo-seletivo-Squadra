import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { useForm } from 'react-hook-form'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import TextField from '@mui/material/TextField'

import PokemonCard from '@/components/PokemonCard'
import { Pokemon, PokemonType, PokemonWeaknesses, Sprites } from '../types'
import PokemonNotFound from '@/components/PokemonNotFound'
import { POKEMON_TYPES } from '@/utils/pokemon-types'
import FiltersModal from '@/components/FiltersModal'
import { Box, Stack } from '@mui/material'

interface HomeProps {
  pokemonList: Pokemon[]
}

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
              (weakness: PokemonWeaknesses) => weakness.name,
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
  const [typesModalOpen, setTypesModalOpen] = useState<boolean>(false)
  const [weaknessesModalOpen, setWeaknessesModalOpen] = useState<boolean>(false)
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false)

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

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 500
    ) {
      handleLoadMore()
    }
    setShowScrollToTop(window.scrollY > 200)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    <Container sx={{ mb: '2rem' }}>
      <Container sx={{ mb: '2rem' }}>
        <form onSubmit={handleSubmit(() => {})}>
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            {...register('name')}
            style={{ marginBottom: '20px' }}
          />
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => setTypesModalOpen(true)}>
              Filter by Types
            </Button>
            <Button
              variant="outlined"
              onClick={() => setWeaknessesModalOpen(true)}
            >
              Filter by Weaknesses
            </Button>
          </Stack>
        </form>
      </Container>

      <FiltersModal
        open={typesModalOpen}
        onClose={() => setTypesModalOpen(false)}
        control={control}
        filterType="types"
        filterLabel="Types"
      />
      <FiltersModal
        open={weaknessesModalOpen}
        onClose={() => setWeaknessesModalOpen(false)}
        control={control}
        filterType="weaknesses"
        filterLabel="Weaknesses"
      />
      <Grid container spacing={3}>
        {filteredPokemonList.length === 0 ? (
          <PokemonNotFound />
        ) : (
          filteredPokemonList
            .slice(0, visiblePokemon)
            .map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))
        )}
      </Grid>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '1rem',
          transition: 'opacity 0.5s',
          opacity: showScrollToTop ? 1 : 0,
          visibility: showScrollToTop ? 'visible' : 'hidden',
        }}
      >
        {visiblePokemon < filteredPokemonList.length && (
          <Button variant="contained" color="primary" onClick={handleLoadMore}>
            Buscar Mais
          </Button>
        )}
        <Button variant="contained" color="secondary" onClick={scrollToTop}>
          Voltar ao Topo
        </Button>
      </Box>
    </Container>
  )
}

export default Home
