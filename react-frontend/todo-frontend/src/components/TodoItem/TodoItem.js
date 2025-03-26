import React, { useState } from 'react';
import CheckboxToggle from './CheckboxToggle';
import TodoDisplay from './TodoDisplay';
import TodoEditor from './TodoEditor';
import './TodoItem.css';

export default function TodoItem({ todo, updateTodo, deleteTodo }) {
  const [editing, setEditing] = useState(false);
  const completedClass = todo.completed ? 'todo-item completed' : 'todo-item';

  const handleEdit = (updatedFields) => {
    updateTodo(todo.id, updatedFields);
    setEditing(false);
  };

  // Ensure tags are passed as an array
  const todoWithTagsArray = {
    ...todo,
    tags: Array.isArray(todo.tags) ? todo.tags : []
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  return (
    <li
      className={`${completedClass} ${editing ? 'editing' : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      <CheckboxToggle
        todo={todoWithTagsArray}
        updateTodo={updateTodo}
        handleEdit={() => handleEdit({ completed: !todo.completed })}
      />
      {editing ? (
        <TodoEditor
          todo={todoWithTagsArray}
          handleEdit={handleEdit}
          deleteTodo={deleteTodo}
          setEditing={setEditing}
        />
      ) : (
        <TodoDisplay todo={todoWithTagsArray} setEditing={setEditing} />
      )}
    </li>
  );
}
