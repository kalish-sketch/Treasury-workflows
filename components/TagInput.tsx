'use client';

import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  placeholder: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagInput({ placeholder, tags, onTagsChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;
    onTagsChange([...tags, val]);
    setInputValue('');
  }

  function removeTag(index: number) {
    onTagsChange(tags.filter((_, i) => i !== index));
  }

  return (
    <div className="tag-input-wrapper">
      {tags.map((tag, i) => (
        <span key={i} className="tag-pill">
          {tag}
          <span className="remove-tag" onClick={() => removeTag(i)}>×</span>
        </span>
      ))}
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
