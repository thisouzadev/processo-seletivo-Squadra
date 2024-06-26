export const readFavoritePokemonIds = (): number[] => {
  const favoritePokemonIdsJson = localStorage.getItem('favoritePokemonIds')
  return favoritePokemonIdsJson ? JSON.parse(favoritePokemonIdsJson) : []
}

export const saveFavoritePokemons = (pokemons: number[]): void => {
  localStorage.setItem('favoritePokemonIds', JSON.stringify(pokemons))
}

export const addPokemonToFavorites = (pokemonId: number): void => {
  const favoritePokemons = readFavoritePokemonIds()
  const newFavoritePokemons = [...favoritePokemons, pokemonId]

  saveFavoritePokemons(newFavoritePokemons)
}

export const removePokemonFromFavorites = (pokemonId: number): void => {
  const favoritePokemons = readFavoritePokemonIds()
  const newFavoritePokemons = favoritePokemons.filter((id) => id !== pokemonId)

  saveFavoritePokemons(newFavoritePokemons)
}
