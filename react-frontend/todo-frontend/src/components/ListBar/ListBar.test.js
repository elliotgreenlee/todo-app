import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ListBar from './ListBar';

describe('ListBar Component', () => {
  const mockOnListClick = jest.fn();

  const lists = ['Active', 'Archived', 'Work', 'Home'];

  test('renders ListBar with default and dynamic lists', () => {
    render(<ListBar lists={lists} onListClick={mockOnListClick} />);

    // Check if the default lists (Active and Archived) are rendered
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();

    // Check if dynamic lists (Work and Home) are rendered
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  test('renders default lists (Active and Archived) with specific styling', () => {
    render(<ListBar lists={lists} onListClick={mockOnListClick} />);

    // Check if the Active and Archived lists have the "default-list" class
    const activeList = screen.getByText('Active');
    const archivedList = screen.getByText('Archived');

    expect(activeList).toHaveClass('default-list');
    expect(archivedList).toHaveClass('default-list');
  });

  test('clicking on a list item triggers onListClick with the correct list name', () => {
    render(<ListBar lists={lists} onListClick={mockOnListClick} />);

    // Click on a default list item
    fireEvent.click(screen.getByText('Active'));
    expect(mockOnListClick).toHaveBeenCalledWith('Active');

    // Click on a dynamic list item
    fireEvent.click(screen.getByText('Work'));
    expect(mockOnListClick).toHaveBeenCalledWith('Work');
  });

  test('renders only unique lists', () => {
    const listsWithDuplicates = ['Active', 'Archived', 'Work', 'Work', 'Home', 'Home'];
    render(<ListBar lists={listsWithDuplicates} onListClick={mockOnListClick} />);

    // The lists should not have duplicates
    expect(screen.getAllByText('Work')).toHaveLength(1);
    expect(screen.getAllByText('Home')).toHaveLength(1);
  });
});
