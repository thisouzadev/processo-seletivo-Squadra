import axios from "axios";
import { Welcome } from "../interfaces/PokemonType";

export async function getPokemonTypeRelation(name: string): Promise<Welcome> {
  const endpoint = `https://pokeapi.co/api/v2/type/${name}`;
  const response = await axios.get<Welcome>(endpoint);

  return response.data;
}
