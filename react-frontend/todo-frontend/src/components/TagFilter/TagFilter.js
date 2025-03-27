import React, { useState } from 'react';
import './TagFilter.css';

export default function TagFilter({ todos, setFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = Array.from(new Set(todos.flatMap(todo => todo.tags || [])));

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setFilter({ searchTerm: newSearchTerm, selectedTags: selectedTags });
  };

  const handleTagClick = (tag) => {
    // Update selectedTags first
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(updatedTags);

    // Now set the filter with updated tags
    setFilter({ searchTerm: searchTerm, selectedTags: updatedTags });
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
