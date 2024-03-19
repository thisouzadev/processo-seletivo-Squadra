import axios from "axios";
import { PokemonDetail } from "./interfaces/PokemonDetail";

export interface ListPokemonsInterface {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonDetail[];
}

export async function listPokemons(): Promise<ListPokemonsInterface> {
  const endpoint = 'https://pokeapi.co/api/v2/pokemon'
  const response = await axios.get<ListPokemonsInterface>(endpoint)

  return response.data
}