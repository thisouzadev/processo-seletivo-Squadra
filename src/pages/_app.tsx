// src/pages/_app.tsx

import * as React from 'react'
import '../styles/globals.css'
import CssBaseline from '@mui/material/CssBaseline'
import { AppProps } from 'next/app'
import Header from '@/components/Header'
import { ThemeContextProvider } from './ThemeContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <ThemeContextProvider>
      <CssBaseline />
      <Header />
      <Component {...pageProps} />
    </ThemeContextProvider>
  )
}
