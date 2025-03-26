import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import './TodoDisplay.css';

export default function TodoDisplay({ todo, setEditing, onTagClick }) {
  const [showDescription, setShowDescription] = useState(false);

  const handleToggleDescription = (e) => {
    e.stopPropagation(); // Prevents triggering editing mode
    setShowDescription(prev => !prev);
  };

  const isArchived = todo.completed;
  const todoTags = Array.isArray(todo.tags) ? todo.tags : [];

  return (
    <div className={`todo-content ${isArchived ? 'archived' : ''}`}>
      <span className={`todo-text ${isArchived ? 'archived-text' : ''}`}>
        {todo.task}
      </span>

      {todo.description && (
        <>
          <button
            type="button"
            className="toggle-markdown-button"
            onClick={handleToggleDescription}
          >
            {showDescription ? "Hide Description" : "View Description"}
          </button>

          {showDescription && <MarkdownRenderer description={todo.description} />}
        </>
      )}

      {todoTags.length > 0 && (
        <div className="todo-tags">
          Tags: {todoTags.map(tag => (
            <span
              key={tag}
              className={`tag ${isArchived ? 'archived-tag' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onTagClick) onTagClick(tag);
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
