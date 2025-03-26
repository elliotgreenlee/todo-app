import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mocking react-markdown
jest.mock('react-markdown', () => (props) => <div>{props.children}</div>);

// Mocking the fetch API
beforeEach(() => {
  global.fetch = jest.fn();
  fetch.mockClear();
});

describe('App Component', () => {
  test('renders the app correctly', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({})
    });

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/Remindr/i)).toBeInTheDocument();
  });

  test('fetches and displays todos', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        1: { id: 1, task: 'Learn Jest', completed: false, tags: ['testing'] },
        2: { id: 2, task: 'Setup Project', completed: true, tags: ['setup'] }
      })
    });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Learn Jest')).toBeInTheDocument();
      expect(screen.getByText('Setup Project')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/todos');
  });

  test('renders AddTodo button and opens form', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({})
    });

    await act(async () => {
      render(<App />);
    });

    const addButton = screen.getByRole('button'); // Floating Plus Button
    expect(addButton).toBeInTheDocument();

    // Trigger AddTodo form (UI interaction test)
    fireEvent.click(addButton);
    expect(screen.getByPlaceholderText('Add a new task')).toBeInTheDocument();
  });

  test('renders TagFilter component', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        1: { id: 1, task: 'Learn Jest', completed: false, tags: ['testing', 'react'] },
        2: { id: 2, task: 'Setup Project', completed: true, tags: ['setup'] }
      })
    });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      // Just confirm TagFilter renders, not the individual tags
      expect(screen.getByPlaceholderText('Search todos...')).toBeInTheDocument();
    });
  });
});
