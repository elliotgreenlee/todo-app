import React from 'react';
import TodoItem from './TodoItem/TodoItem';
import '../App.css';

export default function TodoList({ listName, todos = [], filter, updateTodo, deleteTodo}) {
  const inSearch = (todo, filter) => {
    const matchesSearch = todo.task.toLowerCase().includes(filter.searchTerm.toLowerCase());
    const matchesTags = filter.selectedTags.length === 0 ||
      (todo.tags && filter.selectedTags.every(tag => todo.tags.includes(tag)));
    return matchesSearch && matchesTags;
  };

  const inList = (todo, listName) => {
    const matchesLists = (todo.lists && todo.lists.includes(listName));
    return matchesLists;
  };

  const filteredTodos = todos.filter(todo => inSearch(todo, filter))
  const listTodos = filteredTodos.filter(todo => inList(todo, listName))

  return (
    <div className="todo-list">
      <h2>{listName}</h2>
      <ul className={listTodos.length === 0 ? 'no-todos' : ''}>
        {listTodos.length > 0 ? (
          listTodos.map(todo => (
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
