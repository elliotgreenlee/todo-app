import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoEditor from './TodoEditor';
import DeleteButton from './DeleteButton';

// Mocking the DeleteButton to avoid unrelated testing issues
jest.mock('./DeleteButton', () => ({ todo, deleteTodo }) => (
  <button onClick={() => deleteTodo(todo.id)}>Delete</button>
));

describe('TodoEditor Component', () => {
  const mockHandleEdit = jest.fn();
  const mockDeleteTodo = jest.fn();
  const mockSetEditing = jest.fn();

  const todo = {
    id: 1,
    task: 'Test Task',
    description: 'Test Description',
    tags: ['tag1', 'tag2']
  };

  beforeEach(() => {
    jest.clearAllMocks();  // Clear mocks to prevent test leakage
  });

  // Test to verify that input fields have the correct initial values
  test('renders input fields with correct initial values', () => {
    render(<TodoEditor todo={todo} handleEdit={mockHandleEdit} deleteTodo={mockDeleteTodo} setEditing={mockSetEditing} />);

    const taskInput = screen.getByDisplayValue('Test Task');
    const descriptionInput = screen.getByDisplayValue('Test Description');
    const tagsInput = screen.getByDisplayValue('tag1, tag2');

    expect(taskInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(tagsInput).toBeInTheDocument();
  });

  // Test to check that input changes correctly update state
  test('handles input changes correctly', () => {
    render(<TodoEditor todo={todo} handleEdit={mockHandleEdit} deleteTodo={mockDeleteTodo} setEditing={mockSetEditing} />);

    const taskInput = screen.getByDisplayValue('Test Task');
    const descriptionInput = screen.getByDisplayValue('Test Description');
    const tagsInput = screen.getByDisplayValue('tag1, tag2');

    fireEvent.change(taskInput, { target: { value: 'Updated Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
    fireEvent.change(tagsInput, { target: { value: 'updatedTag1, updatedTag2' } });

    expect(taskInput.value).toBe('Updated Task');
    expect(descriptionInput.value).toBe('Updated Description');
    expect(tagsInput.value).toBe('updatedTag1, updatedTag2');
  });

  // Test that handleEdit is called when clicking outside the editor
  test('calls handleEdit when clicking outside the editor', () => {
    render(<TodoEditor todo={todo} handleEdit={mockHandleEdit} deleteTodo={mockDeleteTodo} setEditing={mockSetEditing} />);

    const taskInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(taskInput, { target: { value: 'New Task Value' } });

    // Simulate a click outside the editor (mousedown event)
    fireEvent.mouseDown(document);

    expect(mockHandleEdit).toHaveBeenCalledWith({
      task: 'New Task Value',
      description: 'Test Description',
      tags: ['tag1', 'tag2']
    });
  });

  // Test that handleEdit is not called when clicking inside the editor
  test('does not call handleEdit when clicking inside the editor', () => {
    render(<TodoEditor todo={todo} handleEdit={mockHandleEdit} deleteTodo={mockDeleteTodo} setEditing={mockSetEditing} />);

    // Get an input element inside the editor and fire a change event on it
    const taskInput = screen.getByDisplayValue('Test Task');
    fireEvent.change(taskInput, { target: { value: 'New Task Value' } });

    // Simulate a click inside the editor
    fireEvent.mouseDown(taskInput);  // Click inside the editor (taskInput)

    // Ensure handleEdit is NOT called because the click was inside the editor
    expect(mockHandleEdit).not.toHaveBeenCalled();
  });

  // Test to ensure deleteTodo is called when the delete button is clicked
  test('calls deleteTodo correctly when DeleteButton is clicked', () => {
    render(<TodoEditor todo={todo} handleEdit={mockHandleEdit} deleteTodo={mockDeleteTodo} setEditing={mockSetEditing} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockDeleteTodo).toHaveBeenCalledWith(1);
  });

  // Test to ensure behavior when tags are null or undefined
  test('handles case where todo tags are null or undefined', () => {
    const todoWithoutTags = { ...todo, tags: null };

    render(<TodoEditor todo={todoWithoutTags} handleEdit={mockHandleEdit} deleteTodo={mockDeleteTodo} setEditing={mockSetEditing} />);

    const tagsInput = screen.getByPlaceholderText('Tags (comma separated)');
    expect(tagsInput).toHaveValue('');  // Should be empty string if tags are null or undefined
  });

  // Test for when todo.description is an empty string
  test('initializes editingDescription as empty string when description is an empty string', () => {
    const todoWithEmptyDescription = { ...todo, description: '' };

    render(<TodoEditor todo={todoWithEmptyDescription} handleEdit={mockHandleEdit} deleteTodo={mockDeleteTodo} setEditing={mockSetEditing} />);

    const descriptionInput = screen.getByPlaceholderText('Description (Markdown supported)');
    expect(descriptionInput).toHaveValue('');  // Should be empty string
  });

  // Test for when todo.description is undefined
  test('initializes editingDescription as empty string when description is undefined', () => {
    const todoWithUndefinedDescription = { ...todo, description: undefined };

    render(<TodoEditor todo={todoWithUndefinedDescription} handleEdit={mockHandleEdit} deleteTodo={mockDeleteTodo} setEditing={mockSetEditing} />);

    const descriptionInput = screen.getByPlaceholderText('Description (Markdown supported)');
    expect(descriptionInput).toHaveValue('');  // Should be empty string
  });
});
