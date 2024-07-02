import React, { useEffect, useState } from 'react'
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Grid,
  Card,
} from '@mui/material'
import axios from 'axios'
import {
  Evolution,
  Pokemon,
  PokemonType,
  PokemonWeaknesses,
  Species,
} from '../types'
import UnoptimizedImage from './UnoptimizedImage'
import { typeColors } from '@/styles/typeColor'
import StatsRadarChart from './StatsRadarChart'

interface DetailsModalProps {
  open: boolean
  onClose: () => void
  pokemonId: number
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  open,
  onClose,
  pokemonId,
}) => {
  const [pokemon, setPokemon] = useState<Pokemon>()
  const [evolutions, setEvolutions] = useState<Evolution[]>([])
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
        )
        const data = response.data
        const types: string[] = data.types.map(
          (type: PokemonType) => type.type.name,
        )
        const weaknessesResponse = await axios.get(
          `https://pokeapi.co/api/v2/type/${types[0]}/`,
        )
        const weaknesses: string[] =
          weaknessesResponse.data.damage_relations.double_damage_from.map(
            (weakness: PokemonWeaknesses) => weakness.name,
          )
        const sprites = data.sprites
        const speciesResponse = await axios.get(data.species.url)
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url
        const evolutionResponse = await axios.get(evolutionChainUrl)
        const evolutionData = evolutionResponse.data.chain

        const getEvolutions = async (chain: Species): Promise<Evolution[]> => {
          const evolutions: Evolution[] = []

          const extractEvolutionDetails = async (evolution: Species) => {
            console.log(evolution)

            const id = parseInt(
              evolution.species.url.split('/').slice(-2, -1)[0],
            )
            await axios
              .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
              .then(async (res) => {
                const types = res.data.types.map(
                  (type: PokemonType) => type.type.name,
                )
                evolutions.push({
                  id,
                  name: evolution.species.name,
                  types,
                  sprite: res.data.sprites.front_default,
                })
                if (evolution.evolves_to.length > 0) {
                  extractEvolutionDetails(evolution.evolves_to[0]!)
                }
              })
          }
          console.log('chain', chain)

          extractEvolutionDetails(chain)
          return evolutions
        }

        setEvolutions(await getEvolutions(evolutionData))
        setPokemon({
          name: data.name,
          id: data.id,
          url: '',
          details: {
            types,
            stats: {
              HP: data.stats[0].base_stat,
              Attack: data.stats[1].base_stat,
              Defense: data.stats[2].base_stat,
              SpecialAttack: data.stats[3].base_stat,
              SpecialDefense: data.stats[4].base_stat,
              Speed: data.stats[5].base_stat,
            },
            weaknesses,
            height: data.height,
            weight: data.weight,
            category: 'Seed', // Example category
            abilities: data.abilities.map(
              (ability: { ability: { name: string } }) => ability.ability.name,
            ),
            sprites: {
              front_default: sprites.front_default,
              versions: {
                'generation-v': {
                  'black-white': {
                    animated: {
                      front_default:
                        sprites.versions['generation-v']['black-white'].animated
                          .front_default,
                    },
                  },
                },
              },
            },
          },
        })
      } catch (error) {
        console.error('Error fetching Pokémon details:', error)
      }
    }

    if (pokemonId) {
      fetchPokemonDetails()
    }
  }, [pokemonId])

  if (!pokemon) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      {pokemon.details && (
        <>
          <DialogTitle>
            <Typography component="h1">{pokemon.name}</Typography>
            <Typography component="h1">ID: {pokemon.id}</Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={7}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <Card
                    sx={{
                      background: '#dee3ed',
                      borderRadius: 2,
                      boxShadow: 3,
                      padding: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
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
                      width={250}
                      height={250}
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
                  </Card>
                </div>
                <Typography variant="body1" style={{ marginTop: '16px' }}>
                  <strong>Stats</strong>
                  <StatsRadarChart stats={pokemon.details.stats!} />
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6} md={5}>
                <Card
                  sx={{
                    background: '#30a7d7',
                    borderRadius: 2,
                    boxShadow: 3,
                    padding: 2,
                    marginBottom: '16px',
                  }}
                >
                  <Typography variant="body1">
                    <strong>Height:</strong> {pokemon.details.height! / 10} m
                  </Typography>
                  <Typography variant="body1">
                    <strong>Weight:</strong> {pokemon.details.weight! / 10} kg
                  </Typography>
                  {/* <Typography variant="body1">
                    <strong>Category:</strong> {pokemon.details.category}
                  </Typography> */}
                  <Typography variant="body1">
                    <strong>Abilities:</strong>{' '}
                    {Array.isArray(pokemon.details.abilities) &&
                      pokemon.details.abilities.join(', ')}
                  </Typography>
                </Card>
                <Typography variant="body1" style={{ marginTop: '16px' }}>
                  <strong>Types</strong>
                  <Grid container spacing={1} style={{ marginTop: '8px' }}>
                    {pokemon.details.types.map((type) => (
                      <Grid item key={type}>
                        <Card
                          sx={{
                            background: typeColors[type],
                            borderRadius: 2,
                            boxShadow: 3,
                            padding: 1,
                          }}
                        >
                          <Typography variant="body1">{type}</Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Typography>

                <Typography variant="body1" style={{ marginTop: '16px' }}>
                  <strong>Weaknesses</strong>
                  <Grid container spacing={1} style={{ marginTop: '8px' }}>
                    {pokemon.details.weaknesses?.map((type) => (
                      <Grid item key={type}>
                        <Card
                          sx={{
                            background: typeColors[type],
                            borderRadius: 2,
                            boxShadow: 3,
                            padding: 1,
                          }}
                        >
                          <Typography variant="body1">{type}</Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12} style={{ marginTop: '16px' }}>
              <Typography variant="body1">
                <strong>Evolutions</strong>
              </Typography>
              <Grid container spacing={2} alignItems="center">
                {evolutions.length > 0 ? (
                  evolutions.map((evolution, index) => (
                    <React.Fragment key={evolution.id}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card
                          sx={{
                            borderRadius: 2,
                            boxShadow: 3,
                            padding: 2,
                            width: '100%',
                            textAlign: 'center',
                          }}
                        >
                          <Grid
                            container
                            direction="column"
                            alignItems="center"
                            spacing={1}
                          >
                            <Grid item>
                              <UnoptimizedImage
                                src={evolution.sprite || '/placeholder.png'}
                                alt={`${evolution.name} sprite`}
                                width={180}
                                height={180}
                              />
                            </Grid>
                            <Grid item>
                              <Typography variant="body1">
                                <strong>{evolution.name}</strong>
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="body2">
                                ID: {evolution.id}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="body1"
                                style={{ marginTop: '16px' }}
                              >
                                <strong>Types</strong>
                              </Typography>
                            </Grid>
                            <Grid item container spacing={1}>
                              {evolution.types.map((type) => (
                                <Grid item key={type} xs={6} sm={4} md={4}>
                                  <Card
                                    sx={{
                                      background: typeColors[type],
                                      borderRadius: 2,
                                      boxShadow: 3,
                                      padding: 1,
                                      width: '100%',
                                      textAlign: 'center',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Typography variant="body1">
                                      {type}
                                    </Typography>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                      {index < evolutions.length - 1 && (
                        <Grid item>
                          <Typography variant="body1">→</Typography>
                        </Grid>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <Typography variant="body2" style={{ marginTop: '16px' }}>
                    This Pokémon has no evolutions.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
export default DetailsModal
