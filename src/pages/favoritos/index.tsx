import React, { useEffect, useState } from 'react'
import { Container, Grid } from '@mui/material'
import PokemonCard from '../../components/PokemonCard'
import { Pokemon } from '../../types'
import axios from 'axios'
import { GetStaticProps } from 'next'
import { limitedPromiseAll } from '../index'
import { readFavoritePokemonIds } from '@/services/favoritePokemon'

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
    const fetchFavoritePokemons = async () => {
      const favoritePokemonIds = readFavoritePokemonIds()
      const filteredPokemons = pokemonList.filter(
        (pokemon) =>
          pokemon.id !== undefined && favoritePokemonIds.includes(pokemon.id),
      )
      setFavoritePokemons(filteredPokemons)
    }

    fetchFavoritePokemons()
  }, [pokemonList])

  return (
    <Container>
      <Grid container spacing={3}>
        {favoritePokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </Grid>
    </Container>
  )
}

export default FavoritePokemons
