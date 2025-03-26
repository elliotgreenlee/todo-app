import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckboxToggle from './CheckboxToggle';

describe('CheckboxToggle Component', () => {
  const mockUpdateTodo = jest.fn();
  const mockHandleEdit = jest.fn();
  const todo = { id: 1, task: 'Test Task', completed: false };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the checkbox with correct state', () => {
    render(<CheckboxToggle todo={todo} updateTodo={mockUpdateTodo} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();  // Initial state is false
  });

  test('calls updateTodo when checkbox is toggled', () => {
    render(<CheckboxToggle todo={todo} updateTodo={mockUpdateTodo} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockUpdateTodo).toHaveBeenCalledWith(1, { completed: true });  // Toggle from false to true
  });

  test('triggers handleEdit if provided', () => {
    render(<CheckboxToggle todo={todo} updateTodo={mockUpdateTodo} handleEdit={mockHandleEdit} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockHandleEdit).toHaveBeenCalled();
  });

  test('handles toggling between completed and not completed', () => {
    const { rerender } = render(<CheckboxToggle todo={todo} updateTodo={mockUpdateTodo} />);

    const checkbox = screen.getByRole('checkbox');

    // First click - Should mark it as completed
    fireEvent.click(checkbox);
    expect(mockUpdateTodo).toHaveBeenCalledWith(1, { completed: true });

    // Update the mock todo to reflect the change and rerender
    todo.completed = true;
    rerender(<CheckboxToggle todo={todo} updateTodo={mockUpdateTodo} />);

    // Second click - Should mark it as not completed
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockUpdateTodo).toHaveBeenCalledWith(1, { completed: false });
  });
});
