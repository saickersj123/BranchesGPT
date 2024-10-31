import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';  // 이 줄을 추가합니다.
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});