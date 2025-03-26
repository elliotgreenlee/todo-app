import React from 'react';
import './CheckboxToggle.css';

function CheckboxToggle({ todo, updateTodo, handleEdit }) {

  function handleToggleCompleted() {
    updateTodo(todo.id, { completed: !todo.completed });

    if (handleEdit) handleEdit();  // Trigger save if in editing mode
  }

  return (
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={handleToggleCompleted}
    />
  );
}

export default CheckboxToggle;
