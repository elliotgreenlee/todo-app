import React from 'react';
import './DeleteButton.css';

export default function DeleteButton({ todo, deleteTodo }) {
  function handleDelete(e) {
    e.stopPropagation();
    deleteTodo(todo.id);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="delete-button"
    >
      Delete
    </button>
  );
}
