import React from 'react';
import './CheckboxToggle.css';

function CheckboxToggle({ todo, updateTodo }) {

  function handleToggle(e) {
    e.stopPropagation();
    updateTodo(todo.id, { completed: !todo.completed});
    let newLists = []
    if (todo.lists.includes('Active')) {
      newLists = todo.lists.filter(list => list !== 'Active');
      newLists = [...newLists, 'Archived']
    }
    else {
      newLists = todo.lists.filter(list => list !== 'Archived');
      newLists = [...newLists, 'Active']
    }
    updateTodo(todo.id, { lists: newLists })
  }

  return (
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={handleToggle}
    />
  );
}

export default CheckboxToggle;
