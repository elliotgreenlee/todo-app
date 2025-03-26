import React from 'react';
import ReactMarkdown from 'react-markdown';
import './MarkdownRenderer.css';

export default function MarkdownRenderer({ description, isArchived }) {
  return (
    <div className={`markdown-preview ${isArchived ? 'archived-markdown' : ''}`}>
      <ReactMarkdown>{description}</ReactMarkdown>
    </div>
  );
}


