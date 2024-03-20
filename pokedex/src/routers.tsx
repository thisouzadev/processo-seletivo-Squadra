import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import FavoritePokemons from "./favorites/FavoritePokemons";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/favoritos",
    element: <FavoritePokemons />,
  },
]);