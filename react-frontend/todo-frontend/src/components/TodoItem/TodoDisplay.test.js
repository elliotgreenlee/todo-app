import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoDisplay from './TodoDisplay';
import MarkdownRenderer from './MarkdownRenderer';

// Mock MarkdownRenderer
jest.mock('./MarkdownRenderer', () => ({ description }) => <div>{description}</div>);

describe('TodoDisplay Component', () => {
  const mockSetEditing = jest.fn();
  const mockOnTagClick = jest.fn();
  const todo = {
    id: 1,
    task: 'Test Task',
    completed: false,
    description: '## Test Description\n\nThis is a markdown description.',
    tags: ['tag1', 'tag2']
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the task name correctly', () => {
    render(<TodoDisplay todo={todo} setEditing={mockSetEditing} onTagClick={mockOnTagClick} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('applies archived class when todo is completed', () => {
    const completedTodo = { ...todo, completed: true };
    render(<TodoDisplay todo={completedTodo} setEditing={mockSetEditing} onTagClick={mockOnTagClick} />);
    expect(screen.getByText('Test Task')).toHaveClass('archived-text');
  });

  test('renders toggle description button and toggles description display', () => {
    render(<TodoDisplay todo={todo} setEditing={mockSetEditing} onTagClick={mockOnTagClick} />);

    const toggleButton = screen.getByText('View Description');
    expect(toggleButton).toBeInTheDocument();

    // Click to show the description
    fireEvent.click(toggleButton);

    // We aren't testing the markdown rendering itself, just that something is displayed
    const descriptionContainer = screen.getByText('Hide Description');
    expect(descriptionContainer).toBeInTheDocument();

    // Click to hide the description
    fireEvent.click(toggleButton);
    expect(screen.getByText('View Description')).toBeInTheDocument();
  });


  test('renders tags and handles tag click', () => {
    render(<TodoDisplay todo={todo} setEditing={mockSetEditing} onTagClick={mockOnTagClick} />);

    const tag1 = screen.getByText('tag1');
    const tag2 = screen.getByText('tag2');

    expect(tag1).toBeInTheDocument();
    expect(tag2).toBeInTheDocument();

    fireEvent.click(tag1);
    expect(mockOnTagClick).toHaveBeenCalledWith('tag1');
  });

  test('renders archived-tag class for completed todos', () => {
    const completedTodo = { ...todo, completed: true };
    render(<TodoDisplay todo={completedTodo} setEditing={mockSetEditing} onTagClick={mockOnTagClick} />);

    const tag1 = screen.getByText('tag1');
    const tag2 = screen.getByText('tag2');

    expect(tag1).toHaveClass('archived-tag');
    expect(tag2).toHaveClass('archived-tag');
  });
});
