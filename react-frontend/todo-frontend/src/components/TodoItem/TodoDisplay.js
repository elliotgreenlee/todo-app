import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import './TodoDisplay.css';

export default function TodoDisplay({ todo, setEditing}) {
  const [showDescription, setShowDescription] = useState(false);

  const handleToggleDescription = (e) => {
    e.stopPropagation();
    setShowDescription(prev => !prev);
  };

  const todoTags = Array.isArray(todo.tags) ? todo.tags : [];

  return (
    <div className={`todo-content ${todo.lists.includes('Archived') ? 'archived' : ''}`}>
      <span className={`todo-text ${todo.lists.includes('Archived') ? 'archived-text' : ''}`}>
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
              className={`tag ${todo.lists.includes('Archived') ? 'archived-tag' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
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
