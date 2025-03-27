// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import AddTodo from './components/AddTodo/AddTodo';
import TodoList from './components/TodoList';
import TagFilter from './components/TagFilter/TagFilter';
import ListBar from './components/ListBar/ListBar';
import './App.css';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState({ searchTerm: "", selectedTags: [] });
  const [selectedList, setSelectedList] = useState('Active'); // Default list is Active

  // Fetch todos (memoized with useCallback)
  const fetchTodos = useCallback(() => {
    fetch('http://127.0.0.1:5000/todos')
      .then(response => response.json())
      .then(data => {
        const todosArray = Object.values(data);
        setTodos(todosArray);
      })
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  // Fetch all todos on initial load
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = (task, description = "", tags = [], lists = ["Active"]) => {
    fetch('http://127.0.0.1:5000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, description, tags, lists })
    })
      .then(response => response.json())
      .then(newTodo => {
        setTodos([...todos, newTodo]);
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
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  // Get unique lists from todos (including "Active" and "Archived")
  const getUniqueLists = () => {
    const allLists = todos.reduce((acc, todo) => {
      if (todo.lists) {
        todo.lists.forEach(list => {
          if (!acc.includes(list)) {
            acc.push(list);
          }
        });
      }
      return acc;
    }, ["Active", "Archived"]);
    return allLists;
  };

  return (
    <div className="app-container">
      <h1>Remindr</h1>
      <TagFilter todos={todos} setFilter={setFilter} />

      <ListBar
        lists={getUniqueLists()}
        onListClick={setSelectedList}
      />

      <TodoList
        listName={selectedList}
        todos={todos}
        filter={filter}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
      />

      <AddTodo addTodo={addTodo} />
    </div>
  );
}
