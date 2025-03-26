import React, { useState, useEffect, useCallback } from 'react';
import AddTodo from './components/AddTodo/AddTodo';
import TodoList from './components/TodoList';
import TagFilter from './components/TagFilter/TagFilter';
import './App.css';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filteredActiveTodos, setFilteredActiveTodos] = useState([]);
  const [filteredArchivedTodos, setFilteredArchivedTodos] = useState([]);
  const [showAddTodo, setShowAddTodo] = useState(false);

  // Fetch todos (memoized with useCallback)
  const fetchTodos = useCallback(() => {
    fetch('http://127.0.0.1:5000/todos')
      .then(response => response.json())
      .then(data => {
        const todosArray = Object.values(data);
        setTodos(todosArray);
        filterTodos(todosArray, "", []);  // Initialize filtered todos with all data
      })
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  // Fetch all todos on initial load
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = (task, description = "", tags = []) => {
    fetch('http://127.0.0.1:5000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, description, tags })
    })
      .then(response => response.json())
      .then(newTodo => {
        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        filterTodos(updatedTodos, "", []);
        setShowAddTodo(false); // Hide AddTodo after adding a task
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  const updateTodo = (id, updatedFields) => {
    fetch(`http://127.0.0.1:5000/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    })
      .then(response => response.json())
      .then(updatedTodo => {
        const updatedTodos = todos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        );
        setTodos(updatedTodos);
        filterTodos(updatedTodos, "", []);
      })
      .catch(error => console.error('Error updating todo:', error));
  };

  const deleteTodo = (id) => {
    fetch(`http://127.0.0.1:5000/todos/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(deletedTodo => {
        const updatedTodos = todos.filter(todo => todo.id !== deletedTodo.id);
        setTodos(updatedTodos);
        filterTodos(updatedTodos, "", []);
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  const filterTodos = (todosArray, searchTerm, selectedTags) => {
    const activeTodos = todosArray.filter(todo => !todo.completed);
    const archivedTodos = todosArray.filter(todo => todo.completed);

    const filterBySearchAndTags = (todoList) =>
      todoList.filter(todo => {
        const matchesSearch = todo.task.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags = selectedTags.length === 0 ||
          (todo.tags && selectedTags.every(tag => todo.tags.includes(tag)));
        return matchesSearch && matchesTags;
      });

    setFilteredActiveTodos(filterBySearchAndTags(activeTodos));
    setFilteredArchivedTodos(filterBySearchAndTags(archivedTodos));
  };

  const handleFilterChange = (searchTerm, selectedTags) => {
    filterTodos(todos, searchTerm, selectedTags);
  };

  return (
    <div className="app-container">
      <h1>Remindr</h1>
      <TagFilter todos={todos} onFilterChange={handleFilterChange} />

      <TodoList
        listName="To Do List"
        todos={filteredActiveTodos}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
      />
      <TodoList
        listName="Logbook"
        todos={filteredArchivedTodos}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
      />

      {/* AddTodo Component */}
      <AddTodo addTodo={addTodo} showAddTodo={showAddTodo} setShowAddTodo={setShowAddTodo} />
    </div>
  );
}
