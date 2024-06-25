// import axios from 'axios'

// interface Pokemon {
//   name: string
//   url: string
//   details: {
//     types: string[]
//     weaknesses: string[]
//     sprites: {
//       front_default: string | null
//       versions: {
//         'generation-v': {
//           'black-white': {
//             animated: {
//               front_default: string
//             }
//           }
//         }
//       }
//     }
//   } | null
// }

// export const limitedPromiseAll = async (
//   requests: { name: string; url: string }[],
//   limit = 10,
// ): Promise<Pokemon[]> => {
//   const results: Pokemon[] = []
//   const batches = Math.ceil(requests.length / limit)

//   for (let i = 0; i < batches; i++) {
//     const batchResults = await Promise.all(
//       requests.slice(i * limit, (i + 1) * limit).map(async (pokemon) => {
//         try {
//           const detailsResponse = await axios.get(pokemon.url)
//           const types = detailsResponse.data.types.map(
//             (type: any) => type.type.name,
//           )
//           const weaknessesResponse = await axios.get(
//             `https://pokeapi.co/api/v2/type/${types[0]}/`,
//           )
//           const weaknesses =
//             weaknessesResponse.data.damage_relations.double_damage_from.map(
//               (weakness: any) => weakness.name,
//             )

//           const sprites = detailsResponse.data.sprites
//           const spriteUrl =
//             sprites.versions['generation-v']['black-white'].animated
//               .front_default

//           return {
//             name: pokemon.name,
//             url: pokemon.url,
//             details: {
//               types,
//               weaknesses,
//               sprites: {
//                 front_default: sprites.front_default,
//                 versions: {
//                   'generation-v': {
//                     'black-white': {
//                       animated: {
//                         front_default: spriteUrl || '', // Ensure front_default is a string
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           }
//         } catch (error) {
//           console.error('Error fetching Pokémon details:', error)
//           return {
//             name: pokemon.name,
//             url: pokemon.url,
//             details: null,
//           }
//         }
//       }),
//     )

//     results.push(...batchResults)
//   }

//   return results
// }

// export default limitedPromiseAll
