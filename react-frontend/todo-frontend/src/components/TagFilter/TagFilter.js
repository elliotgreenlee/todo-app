import React, { useState } from 'react';
import './TagFilter.css';

export default function TagFilter({ todos, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = Array.from(new Set(todos.flatMap(todo => todo.tags || [])));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onFilterChange(e.target.value, selectedTags);
  };

  const handleTagClick = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(updatedTags);
    onFilterChange(searchTerm, updatedTags);
  };

  return (
    <div className="tag-filter-container">
      <input
        type="text"
        placeholder="Search todos..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="tag-filter-search"
      />

      <div className="tag-filter-tags">
        {allTags.map(tag => (
          <span
            key={tag}
            className={`filter-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
