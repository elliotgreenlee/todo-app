import React from 'react';
import './ListBar.css';

export default function ListBar({ lists, onListClick }) {
  const defaultLists = ["Active", "Archived"];
  const otherLists = lists.filter(list => !defaultLists.includes(list));

  return (
    <div className="listbar">
      <h3>Todo Lists</h3>

      {/* Default lists (Active, Archived) always at the top */}
      <ul>
        {defaultLists.map((listName) => (
          <li
            key={listName}
            className="default-list"
            onClick={() => onListClick(listName)}
          >
            {listName}
          </li>
        ))}
      </ul>

      {/* Dynamic lists */}
      <ul>
        {otherLists.map((listName) => (
          <li key={listName} onClick={() => onListClick(listName)}>
            {listName}
          </li>
        ))}
      </ul>
    </div>
  );
}
