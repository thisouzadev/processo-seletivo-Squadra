import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { PokemonDetails } from "./pokemon/PokemonDetails";
import FavoritePokemons from "./favorites/FavoritePokemons";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/pokemon/:name",
    element: <PokemonDetails />,
  },
  {
    path: "/favoritos",
    element: <FavoritePokemons />,
  },
]);