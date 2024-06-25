// import axios from 'axios';
// import limitedPromiseAll from '../lib/limitedPromiseAll'

// interface Pokemon {
//   name: string;
//   url: string;
//   details: {
//     types: string[];
//     weaknesses: string[];
//     sprites: {
//       front_default: string | null;
//       versions: {
//         'generation-v': {
//           'black-white': {
//             animated: {
//               front_default: string;
//             };
//           };
//         };
//       };
//     };
//   } | null;
// }

// export const fetchPokemonList = async (): Promise<Pokemon[]> => {
//   try {
//     const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
//     const pokemonList: Pokemon[] = await limitedPromiseAll(
//       response.data.results.map((pokemon: any) => ({
//         name: pokemon.name,
//         url: pokemon.url,
//       })),
//     );

//     return pokemonList;
//   } catch (error) {
//     console.error('Error fetching Pokémon data:', error);
//     return [];
//   }
// };

// export default fetchPokemonList;
