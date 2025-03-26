import React, { useState, useEffect, useRef } from 'react';
import DeleteButton from './DeleteButton';
import './TodoEditor.css';

export default function TodoEditor({ todo, handleEdit, deleteTodo, setEditing }) {
  const [editingTask, setEditingTask] = useState(todo.task);
  const [editingDescription, setEditingDescription] = useState(todo.description || "");
  const [editingTags, setEditingTags] = useState((todo.tags || []).join(", "));
  const editorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        handleEdit({
          task: editingTask,
          description: editingDescription,
          tags: editingTags.split(',').map(tag => tag.trim()).filter(Boolean)
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingTask, editingDescription, editingTags, handleEdit]);

  return (
    <div ref={editorRef} className="todo-editor">
      <input
        type="text"
        value={editingTask}
        className="editing-input"
        onChange={e => setEditingTask(e.target.value)}
      />
      <textarea
        value={editingDescription}
        className="editing-textarea"
        onChange={e => setEditingDescription(e.target.value)}
        placeholder="Description (Markdown supported)"
      />
      <input
        type="text"
        value={editingTags}
        className="editing-tags"
        onChange={e => setEditingTags(e.target.value)}
        placeholder="Tags (comma separated)"
      />
      <DeleteButton todo={todo} deleteTodo={deleteTodo} />
    </div>
  );
}
