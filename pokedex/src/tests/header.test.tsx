import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { ThemeProvider } from '../ThemeContext';

test('renders header with correct links', () => {
  render(
    <BrowserRouter>
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    </BrowserRouter>
  );

  const pokedexLink = screen.getByText('Pokedex');
  const favoritesLink = screen.getByText('Favoritos');

  expect(pokedexLink).toBeInTheDocument();
  expect(pokedexLink).toHaveAttribute('href', '/');
  expect(favoritesLink).toBeInTheDocument();
  expect(favoritesLink).toHaveAttribute('href', '/favoritos');
});

test('toggles theme when theme button is clicked', () => {
  render(
    <BrowserRouter>
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    </BrowserRouter>
  );

  const themeButton = screen.getByRole('button');
  userEvent.click(themeButton);

  const themeEmoji = screen.getByText(/🌞|🌙/);

  expect(themeEmoji).toBeInTheDocument();
});