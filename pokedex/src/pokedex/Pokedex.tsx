import React, { useEffect, useState } from 'react';
import { listPokemons } from '../pokemon/services/listPokemons';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Container, Grid, Pagination, Button, FormControl, InputLabel, Select, TextField, MenuItem, CircularProgress } from '@mui/material';
import PokedexCard from './components/PokedexCard';
import { PokemonDetail } from '../pokemon/interfaces/PokemonDetail';
import { Welcome } from '../pokemon/interfaces/PokemonType';
import { getPokemonTypeRelation } from '../pokemon/services/getPokemonTypeRelation';
import Header from '../components/Header';
import { useThemeContext } from '../ThemeContext';

interface PokedexProps {

}

export const Pokedex: React.FC<PokedexProps> = () => {
  const { theme } = useThemeContext();

  const [pokemons, setPokemons] = useState<PokemonDetail[]>([])
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [pokemonTypes, setPokemonTypes] = useState<Welcome[]>([]);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [weaknessFilter, setWeaknessFilter] = useState<string>('');
  const [additionalPokemons, setAdditionalPokemons] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: any, value: number) => {
    setCurrentPage(value);
  };

  const handleFilter = async () => {
    setLoading(true);
  
    if (nameFilter === '' && weaknessFilter === '' && typeFilter === '') {
      getListPokemons();
      setLoading(false);
      return;
    }
  
    const response = await listPokemons(1);
    const filteredPokemons = response.results.filter(pokemon => 
      (nameFilter === '' || pokemon.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (typeFilter === '' || pokemon.types.some(type => type.type.name === typeFilter)) &&
      (!pokemon.weaknesses || weaknessFilter === '' || pokemon.weaknesses.includes(weaknessFilter))
    );
  
    setPokemons(filteredPokemons);
    
    setLoading(false);
  };

  const getListPokemons = async () => {
    const response = await listPokemons(currentPage, additionalPokemons);
    setPokemons(response.results);
    setTotalPages(Math.ceil(response.count / 10));
  };

  useEffect(() => {
    handleFilter()
  }, [currentPage, additionalPokemons]);

  useEffect(() => {
    const fetchPokemonTypes = async () => {
      const allPokemonTypes: Welcome[] = [];
      for (let i = 1; i <= 18; i++) {
        const typeResponse = await getPokemonTypeRelation(i.toString());
        allPokemonTypes.push(typeResponse);
      }
      setPokemonTypes(allPokemonTypes);
    };

    fetchPokemonTypes();
  }, []);

  return (
    <Box sx={{ backgroundColor: theme === 'light' ? '#fff' : '#333' }}>
      <Header />
    <Container>
      <Container maxWidth="lg">
        <Box mt={4} display='flex' justifyContent='center' alignItems='center'>
          <TextField
            label="Nome do Pokémon"
            variant="outlined"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 80 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as string)}
              label="Tipo"
            >
              <MenuItem value="">Todos</MenuItem>
              {pokemonTypes.map((type) => (
                <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Fraqueza</InputLabel>
            <Select
              value={weaknessFilter}
              onChange={(e) => setWeaknessFilter(e.target.value as string)}
              label="Fraqueza"
            >
              <MenuItem value=""><em>Todas</em></MenuItem>
              {pokemonTypes.map((type) => (
                <MenuItem key={type.name} value={type.name}>{type.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleFilter} sx={{ ml: 2 }}>Filtrar</Button>
        </Box>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              pokemons encontrado {pokemons.length}
            </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="section" mt={5}>
            <Grid container spacing={2}>
              {pokemons.map((pokemon) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.name}>
                  <PokedexCard pokemon={pokemon} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
      <Container>
        <Box mt={2} display='flex' justifyContent='center' alignItems='center'>
          <Pagination count={totalPages} page={currentPage} onChange={handleChange} />
          <TextField
            label="Quantidade adicional de Pokemon"
            type="number"
            value={additionalPokemons}
            onChange={(e) => setAdditionalPokemons(parseInt(e.target.value))}
          />
        </Box>
      </Container>
      </Container>
    </Box>
  );
};

export default Pokedex;

