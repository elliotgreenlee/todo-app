import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteButton from './DeleteButton';

describe('DeleteButton Component', () => {
  const mockDeleteTodo = jest.fn();
  const todo = { id: 1, task: 'Test Task' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the delete button', () => {
    render(<DeleteButton todo={todo} deleteTodo={mockDeleteTodo} />);

    const button = screen.getByRole('button', { name: /Delete/i });
    expect(button).toBeInTheDocument();
  });

  test('calls deleteTodo with the correct id when clicked', () => {
    render(<DeleteButton todo={todo} deleteTodo={mockDeleteTodo} />);

    const button = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(button);

    expect(mockDeleteTodo).toHaveBeenCalledTimes(1);
    expect(mockDeleteTodo).toHaveBeenCalledWith(1);
  });
});
