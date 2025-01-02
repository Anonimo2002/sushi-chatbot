import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Sushi Chatbot/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders Menu', () => {
  render(<App />);
  const menuElement = screen.getByRole('Menu');
  expect(menuElement).toBeInTheDocument();
});

test('renders Chatbot', () => {
  render(<App />);
  const chatbotElement = screen.getByRole('Chatbot');
  expect(chatbotElement).toBeInTheDocument();
});