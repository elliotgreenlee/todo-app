import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TagFilter from './TagFilter';

describe('TagFilter Component', () => {
  const todos = [
    { id: 1, task: 'Learn Jest', tags: ['testing', 'react'] },
    { id: 2, task: 'Build Project', tags: ['react', 'project'] },
    { id: 3, task: 'Setup Environment', tags: ['setup', 'environment'] }
  ];

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input and tags', () => {
    render(<TagFilter todos={todos} onFilterChange={mockOnFilterChange} />);

    // Check if the search input is rendered
    const searchInput = screen.getByPlaceholderText('Search todos...');
    expect(searchInput).toBeInTheDocument();

    // Check if tags are rendered
    expect(screen.getByText('testing')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('project')).toBeInTheDocument();
    expect(screen.getByText('setup')).toBeInTheDocument();
    expect(screen.getByText('environment')).toBeInTheDocument();
  });

  test('calls onFilterChange when search term changes', () => {
    render(<TagFilter todos={todos} onFilterChange={mockOnFilterChange} />);

    const searchInput = screen.getByPlaceholderText('Search todos...');
    fireEvent.change(searchInput, { target: { value: 'Learn' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith('Learn', []);
  });

  test('calls onFilterChange when tags are selected and unselected', () => {
    render(<TagFilter todos={todos} onFilterChange={mockOnFilterChange} />);

    const reactTag = screen.getByText('react');
    const testingTag = screen.getByText('testing');

    // Click 'react' tag to select it
    fireEvent.click(reactTag);
    expect(mockOnFilterChange).toHaveBeenCalledWith('', ['react']);

    // Click 'testing' tag to select it
    fireEvent.click(testingTag);
    expect(mockOnFilterChange).toHaveBeenCalledWith('', ['react', 'testing']);

    // Click 'react' tag again to unselect it
    fireEvent.click(reactTag);
    expect(mockOnFilterChange).toHaveBeenCalledWith('', ['testing']);
  });

  test('renders selected tags with the correct class', () => {
    render(<TagFilter todos={todos} onFilterChange={mockOnFilterChange} />);

    const reactTag = screen.getByText('react');
    const testingTag = screen.getByText('testing');

    // Select the 'react' tag
    fireEvent.click(reactTag);

    // Check if the 'react' tag has the 'selected' class
    expect(reactTag).toHaveClass('selected');
    expect(testingTag).not.toHaveClass('selected');
  });
});
