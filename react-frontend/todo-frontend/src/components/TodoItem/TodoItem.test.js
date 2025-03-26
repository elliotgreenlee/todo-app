import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoItem from './TodoItem';

// Mocking Subcomponents
jest.mock('./CheckboxToggle', () => ({ todo, updateTodo, handleEdit }) => (
  <input
    type="checkbox"
    checked={todo.completed}
    onChange={handleEdit}
    data-testid="checkbox-toggle"
  />
));

jest.mock('./TodoDisplay', () => ({ todo, setEditing }) => (
  <div onDoubleClick={() => setEditing(true)} data-testid="todo-display">
    {todo.task}
  </div>
));

jest.mock('./TodoEditor', () => ({ todo, handleEdit, deleteTodo, setEditing }) => (
  <div data-testid="todo-editor">
    <button onClick={() => handleEdit({ task: 'Updated Task' })}>Save</button>
    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
    <button onClick={() => setEditing(false)}>Cancel</button>
  </div>
));

describe('TodoItem Component', () => {
  const mockUpdateTodo = jest.fn();
  const mockDeleteTodo = jest.fn();

  const todo = {
    id: 1,
    task: 'Test Task',
    completed: false,
    description: 'Test Description',
    tags: ['tag1', 'tag2']
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders TodoDisplay by default', () => {
    render(<TodoItem todo={todo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);

    const todoDisplay = screen.getByTestId('todo-display');
    expect(todoDisplay).toBeInTheDocument();
    expect(todoDisplay).toHaveTextContent('Test Task');
  });

  test('switches to editing mode when double-clicked', () => {
    render(<TodoItem todo={todo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);

    const todoDisplay = screen.getByTestId('todo-display');
    fireEvent.doubleClick(todoDisplay);

    const todoEditor = screen.getByTestId('todo-editor');
    expect(todoEditor).toBeInTheDocument();
  });

  test('calls updateTodo when save is clicked in TodoEditor', () => {
    render(<TodoItem todo={todo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);

    const todoDisplay = screen.getByTestId('todo-display');
    fireEvent.doubleClick(todoDisplay);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockUpdateTodo).toHaveBeenCalledWith(1, { task: 'Updated Task' });
  });

  test('calls deleteTodo when delete is clicked in TodoEditor', () => {
    render(<TodoItem todo={todo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);

    const todoDisplay = screen.getByTestId('todo-display');
    fireEvent.doubleClick(todoDisplay);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockDeleteTodo).toHaveBeenCalledWith(1);
  });

  test('toggles checkbox and calls handleEdit', () => {
    render(<TodoItem todo={todo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);

    const checkbox = screen.getByTestId('checkbox-toggle');
    fireEvent.click(checkbox);

    expect(mockUpdateTodo).toHaveBeenCalledWith(1, { completed: true });
  });

  test('applies completed class when todo is completed', () => {
    const completedTodo = { ...todo, completed: true };

    render(<TodoItem todo={completedTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);

    const listItem = screen.getByRole('listitem');
    expect(listItem).toHaveClass('todo-item completed');
  });
  test('handles case where todo tags are not an array', () => {
    const invalidTagsTodo = { ...todo, tags: null };  // Making tags null to trigger the false branch

    render(<TodoItem todo={invalidTagsTodo} updateTodo={mockUpdateTodo} deleteTodo={mockDeleteTodo} />);

    const todoDisplay = screen.getByTestId('todo-display');
    expect(todoDisplay).toBeInTheDocument();
  });
});
