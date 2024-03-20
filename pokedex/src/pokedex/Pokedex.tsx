import React, { useEffect, useState } from 'react';
import {  PokemonListInterface, listPokemons } from '../pokemon/services/listPokemons';
import { getPokemonsDetails } from '../pokemon/services/getPokemonDetails';
import { PokemonDetail } from '../pokemon/interfaces/PokemonDetail';

interface PokedexProps {
  
}

export const Pokedex: React.FC<PokedexProps> = () => {
  const [pokemons, setPokemons] = useState<PokemonListInterface[]>([])
  const [selectedPokemon, setSelectPokemon] = useState<PokemonListInterface | undefined>(undefined)
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

      {pokemons.map((pokemon) => <button onClick={() => setSelectPokemon(pokemon)}>{pokemon.name}</button>)}
      <h2>Pokemon selecionado: {selectedPokemon?.name || "Nenhum pokemon selecionado"}</h2>
      {JSON.stringify(selectedPokemonDetails, undefined, 2)}
    </div>
  );
};

export default Pokedex;