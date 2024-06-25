import React from 'react'
import axios from 'axios'
import { GetStaticProps } from 'next'
import UnoptimizedImage from '@/components/UnoptimizedImage'

interface Pokemon {
  name: string
  url: string
  details: {
    types: string[]
    weaknesses: string[]
    sprites: {
      front_default: string | null
      versions: {
        'generation-v': {
          'black-white': {
            animated: {
              front_default: string | null
            }
          }
        }
      }
    }
  } | null
}

interface HomeProps {
  pokemonList: Pokemon[]
}

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
            (type: any) => type.type.name,
          )
          const weaknessesResponse = await axios.get(
            `https://pokeapi.co/api/v2/type/${types[0]}/`,
          )
          const weaknesses =
            weaknessesResponse.data.damage_relations.double_damage_from.map(
              (weakness: any) => weakness.name,
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
  if (!pokemonList) return <div>Loading...</div>

  return (
    <div>
      <h1>Pokémon Names, Types, Weaknesses, and Sprites</h1>
      <ul>
        {pokemonList.map((pokemon, index) => (
          <li key={index}>
            <strong>{pokemon.name}</strong>
            <ul>
              {pokemon.details && (
                <>
                  <li>Types: {pokemon.details.types.join(', ')}</li>
                  <li>Weaknesses: {pokemon.details.weaknesses.join(', ')}</li>
                  <li>
                    Sprite:
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
                  </li>
                </>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
