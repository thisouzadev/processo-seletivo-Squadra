export interface Pokemon {
  name: string
  url: string
  id: number
  details: {
    types: string[]
    weaknesses: string[]
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
