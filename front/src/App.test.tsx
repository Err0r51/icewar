import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/jest-dom';
import App from './App'

// eslint-disable-next-line no-undef
it('renders learn react link', () => {
  render(<App />)
  const linkElement = screen.getByText(/learn react/i)
  // eslint-disable-next-line no-undef
  expect(linkElement).toBeInTheDocument()
})
