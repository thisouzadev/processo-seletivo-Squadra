import axios from "axios";
import { getPokemonsDetails } from "./getPokemonDetails";
import { PokemonDetail } from "../interfaces/PokemonDetail";
import { getPokemonTypeRelation } from "./getPokemonTypeRelation";
import { Generation } from "../interfaces/PokemonType";

export interface PokemonListInterface {
  name: string;
  url: string;
}

export interface ListPokemonsInterface {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonDetail[];
}

export async function listPokemons(page: number = 1, limit: number = 150): Promise<ListPokemonsInterface> {
  const offset = (page - 1) * limit;
  const endpoint = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offset}`;
  const response = await axios.get<ListPokemonsInterface>(endpoint);
  const count = 150;
  const promiseArr = response.data.results.map(async (pokemon) => {
    const pokemonDetails = await getPokemonsDetails(pokemon.name);
    const pokemonTypes = pokemonDetails.types.map(type => type.type.name);
    const pokemonTypePromises = pokemonTypes.map(type => getPokemonTypeRelation(type));
    const pokemonTypeRelations = await Promise.all(pokemonTypePromises);

    const weaknesses: string[] = []; 
    const strengths: string[] = [];
    
    for (const typeRelation of pokemonTypeRelations) {
        if (typeRelation && typeRelation.damage_relations && typeRelation.damage_relations.double_damage_from) {
            weaknesses.push(...typeRelation.damage_relations.double_damage_from.map((weakness: Generation) => weakness.name));
            strengths.push(...typeRelation.damage_relations.double_damage_to.map((strength: Generation) => strength.name));
        }
    }

    return { ...pokemonDetails, weaknesses, strengths };
});

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const resultsPromise = await Promise.all(promiseArr);

  return {
    ...response.data,
    count: count,
    results: resultsPromise,
  };
}

