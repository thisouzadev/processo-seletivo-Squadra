import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { getPokemonTypeRelation } from '../pokemon/services/getPokemonTypeRelation';
import { Welcome } from '../pokemon/interfaces/PokemonType';
describe('getPokemonTypeRelation function', () => {
  const pokemonTypes = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'];

  it('fetches pokemon types correctly', async () => {
    const mockAxios = new MockAdapter(axios);

    pokemonTypes.forEach((type) => {
      const MOCK_POKEMON_TYPE: Welcome = {
        id: 1,
        name: type,
        damage_relations: {
          double_damage_from: [],
          double_damage_to: [],
          half_damage_from: [],
          half_damage_to: [],
          no_damage_from: [],
          no_damage_to: [],
        },
        game_indices: [],
        generation: { name: '', url: '' },
        move_damage_class: { name: '', url: '' },
        moves: [],
        names: [],
        past_damage_relations: [],
        pokemon: [],
      };

      mockAxios.onGet(`https://pokeapi.co/api/v2/type/${type}`).reply(200, MOCK_POKEMON_TYPE);
    });

    const promises = pokemonTypes.map(async (type) => {
      const result = await getPokemonTypeRelation(type);
      const expectedType: Welcome = {
        id: 1,
        name: type,
        damage_relations: {
          double_damage_from: [],
          double_damage_to: [],
          half_damage_from: [],
          half_damage_to: [],
          no_damage_from: [],
          no_damage_to: [],
        },
        game_indices: [],
        generation: { name: '', url: '' },
        move_damage_class: { name: '', url: '' },
        moves: [],
        names: [],
        past_damage_relations: [],
        pokemon: [],
      };
      expect(result).toEqual(expectedType);
    });

    await Promise.all(promises);
  });
});
