export const readFavoritePokemonIds = (): number[] => {
  const favoritePokemonIdsJson = localStorage.getItem('favoritePokemonIds');
  return favoritePokemonIdsJson ? JSON.parse(favoritePokemonIdsJson) : [];
};

const saveFavoritePokemons = (pokemons: number[]): void => {
  localStorage.setItem('favoritePokemonIds', JSON.stringify(pokemons));
};

const addPokemonToFavorites = (pokemonId: number): void => {
  const favoritePokemons = readFavoritePokemonIds();
  const newFavoritePokemons = [...favoritePokemons, pokemonId];

  saveFavoritePokemons(newFavoritePokemons);
};

const removePokemonFromFavorites = (pokemonId: number): void => {
  const favoritePokemons = readFavoritePokemonIds();
  const newFavoritePokemons = favoritePokemons.filter((id) => id !== pokemonId);

  saveFavoritePokemons(newFavoritePokemons);
};

export const updateFavoritePokemons = (pokemonId: number, isFavorite: boolean): void => (
  isFavorite ? addPokemonToFavorites(pokemonId) : removePokemonFromFavorites(pokemonId)
);
