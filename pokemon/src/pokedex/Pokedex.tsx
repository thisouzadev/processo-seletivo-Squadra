import React, { useEffect, useState } from 'react';
import { listPokemons } from '../Pokemon/services/listPokemons';

interface PokedexProps {
  
}

interface PokemonListInterface {
  name: string;
  url: string;
}
export const Pokedex: React.FC<PokedexProps> = () => {
  const [pokemons, setPokemons] = useState<any>([])

  useEffect(() =>{
    listPokemons().then((response) => setPokemons(response.results))
  }, [])
  return (
    <div>
      <h1>Pokedex</h1>

      Pokemons:

      {pokemons.map((pokemon: any) => <h2>{pokemon.name}</h2>)}
    </div>
  );
};

export default Pokedex;