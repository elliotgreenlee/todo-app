import React from 'react';
import TodoItem from './TodoItem/TodoItem';
import '../App.css';

export default function TodoList({ listName, todos = [], updateTodo, deleteTodo, filterTodo = () => true }) {
  // Filter the todos based on the provided filter function
  const filteredTodos = todos.filter(todo => filterTodo(todo));

  return (
    <div className="todo-list">
      <h2>{listName}</h2>
      <ul className={filteredTodos.length === 0 ? 'no-todos' : ''}>
        {filteredTodos.length > 0 ? (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
          ))
        ) : (
          <li>No todos to display</li>
        )}
      </ul>
    </div>
  );
}
