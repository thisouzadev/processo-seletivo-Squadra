import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const PokemonNaoEncontrado: React.FC = () => {
  return (
    <Box textAlign="center" p={3}>
      <Typography variant="h5">Nenhum Pokémon encontrado.</Typography>
      <Typography variant="body1">
        Tente ajustar seus filtros de pesquisa.
      </Typography>
    </Box>
  )
}

export default PokemonNaoEncontrado
