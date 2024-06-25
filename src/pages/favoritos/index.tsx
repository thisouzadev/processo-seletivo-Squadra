import React, { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material'
import PokemonCard from '../../components/PokemonCard'
import { Pokemon } from '../types'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { limitedPromiseAll } from '../index'

interface FavoritePokemonsProps {
  pokemonList: Pokemon[]
}

export const getStaticProps: GetStaticProps<
  FavoritePokemonsProps
> = async () => {
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

const FavoritePokemons: React.FC<FavoritePokemonsProps> = ({ pokemonList }) => {
  const [favoritePokemons, setFavoritePokemons] = useState<Pokemon[]>([])

  useEffect(() => {
    const readFavoritePokemonIds = (): number[] => {
      const favoritePokemonIdsJson = localStorage.getItem('favoritePokemonIds')
      return favoritePokemonIdsJson ? JSON.parse(favoritePokemonIdsJson) : []
    }

    const fetchFavoritePokemons = async () => {
      const favoritePokemonIds = readFavoritePokemonIds()
      const filteredPokemons = pokemonList.filter((pokemon) =>
        favoritePokemonIds.includes(pokemon.id),
      )
      setFavoritePokemons(filteredPokemons)
    }

    fetchFavoritePokemons()
  }, [pokemonList])

  return (
    <div>
      <Container>
        <div style={{ marginTop: `1em` }}>
          <Grid container spacing={2}>
            {favoritePokemons.map((pokemon) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.name}>
                <PokemonCard pokemon={pokemon} />
              </Grid>
            ))}
          </Grid>
        </div>
      </Container>
    </div>
  )
}

export default FavoritePokemons
