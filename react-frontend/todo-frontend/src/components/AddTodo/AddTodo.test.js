import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddTodo from './AddTodo';

describe('AddTodo Component', () => {
  test('renders floating plus button', () => {
    render(<AddTodo addTodo={() => {}} />);
    const plusButton = screen.getByRole('button');
    expect(plusButton).toBeInTheDocument();
  });

  test('opens add todo form', () => {
    render(<AddTodo addTodo={() => {}} />);
    const plusButton = screen.getByRole('button');
    fireEvent.click(plusButton);

    const input = screen.getByPlaceholderText('Add a new task');
    expect(input).toBeInTheDocument();
  });

  test('adds a new todo', () => {
    const mockAddTodo = jest.fn();
    render(<AddTodo addTodo={mockAddTodo} />);

    const plusButton = screen.getByRole('button');
    fireEvent.click(plusButton);

    const taskInput = screen.getByPlaceholderText('Add a new task');
    const descInput = screen.getByPlaceholderText('Description (Markdown supported)');
    const tagsInput = screen.getByPlaceholderText('Tags (comma separated)');
    const addButton = screen.getByText('Add Todo');

    fireEvent.change(taskInput, { target: { value: 'Learn Jest' } });
    fireEvent.change(descInput, { target: { value: 'Testing in React' } });
    fireEvent.change(tagsInput, { target: { value: 'testing, react' } });
    fireEvent.click(addButton);

    expect(mockAddTodo).toHaveBeenCalledWith('Learn Jest', 'Testing in React', ['testing', 'react']);
  });

  test('cancels adding a todo', () => {
    render(<AddTodo addTodo={() => {}} />);

    const plusButton = screen.getByRole('button');
    fireEvent.click(plusButton);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    const input = screen.queryByPlaceholderText('Add a new task');
    expect(input).not.toBeInTheDocument();
  });
});
