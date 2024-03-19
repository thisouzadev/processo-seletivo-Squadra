import React, { useEffect, useState } from 'react';
import { listPokemons } from '../Pokemon/services/listPokemons';
import { getPokemonsDetails } from '../Pokemon/services/getPokemonDetails';
import { PokemonDetail } from '../Pokemon/interfaces/PokemonDetail';

interface PokedexProps {
  
}

// interface PokemonListInterface {
//   name: string;
//   url: string;
// }
export const Pokedex: React.FC<PokedexProps> = () => {
  const [pokemons, setPokemons] = useState<any>([])
  const [selectedPokemon, setSelectPokemon] = useState<any>(undefined)
  const [selectedPokemonDetails, setSelectedPokemonDetails] = useState<PokemonDetail | undefined>(undefined)
  useEffect(() =>{
    listPokemons().then((response) => setPokemons(response.results))
  }, [])

  useEffect(() =>{
    if (!selectedPokemon) return;
    getPokemonsDetails(selectedPokemon.name)
      .then((response) => setSelectedPokemonDetails(response))
  }, [selectedPokemon])
  return (
    <div>
      <h1>Pokedex</h1>

      Pokemons:

      {pokemons.map((pokemon: any) => <button onClick={() => setSelectPokemon(pokemon)}>{pokemon.name}</button>)}
      <h2>Pokemon selecionado: {selectedPokemon?.name || "Nenhum pokemon selecionado"}</h2>
      {JSON.stringify(selectedPokemonDetails, undefined, 2)}
    </div>
  );
};

export default Pokedex;