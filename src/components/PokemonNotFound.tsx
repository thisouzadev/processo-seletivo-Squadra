import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const PokemonNotFound: React.FC = () => {
  return (
    <Box textAlign="center" p={3}>
      <Typography variant="h5">Nenhum Pokémon encontrado.</Typography>
      <Typography variant="body1">
        Tente ajustar seus filtros de pesquisa.
      </Typography>
    </Box>
  )
}

export default PokemonNotFound
