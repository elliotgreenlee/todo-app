import React, { useState } from 'react';
import { Plus } from 'react-feather';
import './AddTodo.css';

export default function AddTodo({ addTodo }) {
  const [newTask, setNewTask] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [lists, setLists] = useState('Active')
  const [showAddTodo, setShowAddTodo] = useState(false);

  function emptyTodo() {
    setNewTask('');
    setDescription('');
    setTags('');
    setLists('')
  }

  function handleAddTodo() {
    if (!newTask.trim()) return;  // Ignore if task text is empty

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const listsArray = lists.split(',').map(list => list.trim()).filter(Boolean);
    addTodo(newTask, description, tagsArray, listsArray);

    emptyTodo()
    setShowAddTodo(false);
  }

  function handleCancel() {
    emptyTodo()
    setShowAddTodo(false);
  }

  return (
  <>
    {showAddTodo ? (
      <div className="add-todo-container">
        <input
          type="text"
          className="add-todo-input"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <textarea
          className="add-todo-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (Markdown supported)"
        />
        <input
          type="text"
          className="add-todo-tags"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
        />
        <div className="add-todo-buttons">
          <button className="add-todo-button" onClick={handleAddTodo}>Add Todo</button>
          <button className="cancel-todo-button" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
      ) : (
        <button className="floating-plus-button" onClick={() => setShowAddTodo(true)}>
          <Plus size={28} />
        </button>
      )
    }
  </>
  );
}
