import { Control } from 'react-hook-form'

export interface Pokemon {
  name: string
  url: string
  id?: number
  details: {
    types: string[]
    weaknesses?: string[]
    sprites: {
      front_default: string | null
      versions: {
        'generation-v': {
          'black-white': {
            animated: {
              front_default: string | null
            }
          }
        }
      }
    }
  } | null
}

export interface PokemonType {
  type: {
    name: string
  }
}

export interface Sprites {
  front_default: string | null
  versions: {
    'generation-v': {
      'black-white': {
        animated: {
          front_default: string
        }
      }
    }
  }
}

export interface FormValues {
  name: string
  types: Record<string, boolean>
  weaknesses: Record<string, boolean>
}

export interface FiltersModalProps {
  open: boolean
  onClose: () => void
  control: Control<FormValues>
  filterType: 'types' | 'weaknesses'
  filterLabel: string
}

export const POKEMON_TYPES = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
] as const
