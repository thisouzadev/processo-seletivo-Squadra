import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { FiltersModalProps } from '../types'
import { POKEMON_TYPES } from '@/utils/pokemon-types'

const FiltersModal: React.FC<FiltersModalProps> = ({
  open,
  onClose,
  control,
  filterType,
  filterLabel,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Filter by ${filterLabel}`}</DialogTitle>
      <DialogContent>
        <FormGroup>
          {POKEMON_TYPES.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Controller
                  name={`${filterType}.${type}` as const}
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={Boolean(field.value)} />
                  )}
                />
              }
              label={type}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default FiltersModal
