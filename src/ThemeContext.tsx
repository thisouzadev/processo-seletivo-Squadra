import React, { createContext, useContext, useState, ReactNode } from 'react'
import { ThemeProvider, Theme } from '@mui/material/styles'
import { lightTheme, darkTheme } from './theme'

interface ThemeContextProps {
  toggleTheme: () => void
  theme: Theme
}

const ThemeContext = createContext<ThemeContextProps>({
  toggleTheme: () => {},
  theme: lightTheme,
})

export const useThemeContext = () => useContext(ThemeContext)

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState(lightTheme)

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme.palette.mode === 'light' ? darkTheme : lightTheme,
    )
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}
