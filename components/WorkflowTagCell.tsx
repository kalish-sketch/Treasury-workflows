'use client';

import { useState, KeyboardEvent, useMemo } from 'react';

interface WorkflowTagCellProps {
  htmlContent: string;
  type: 'who' | 'systems';
  isInspo?: boolean;
  onChange: (newHtml: string) => void;
}

const WHO_CLASS_MAP: Record<string, string> = {
  'treasury analyst': 'who-analyst',
  'treasurer': 'who-treasurer',
  'ap team': 'who-ap',
  'ar team': 'who-ar',
  'controller': 'who-controller',
  'fp&a': 'who-fpa',
  'bank': 'who-bank',
  'it': 'who-it',
  'legal': 'who-legal',
  'tax': 'who-tax',
};

function parseTagsFromHtml(html: string): string[] {
  if (!html) return [];
  // Extract text content from each <span> tag
  const regex = /<span[^>]*>([^<]+)<\/span>/gi;
  const tags: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].trim();
    if (text) tags.push(text);
  }
  return tags;
}

function tagsToHtml(tags: string[], type: 'who' | 'systems'): string {
  return tags.map(tag => {
    if (type === 'who') {
      const cls = WHO_CLASS_MAP[tag.toLowerCase()] || 'who-treasurer';
      return `<span class="who-tag ${cls}">${tag}</span>`;
    }
    return `<span class="sys-tag">${tag}</span>`;
  }).join(' ');
}

export default function WorkflowTagCell({ htmlContent, type, isInspo, onChange }: WorkflowTagCellProps) {
  const tags = useMemo(() => parseTagsFromHtml(htmlContent), [htmlContent]);
  const [inputValue, setInputValue] = useState('');
  const [editing, setEditing] = useState(false);

  function removeTag(index: number) {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(tagsToHtml(newTags, type));
  }

  function addTag() {
    const val = inputValue.trim();
    if (!val) return;
    const newTags = [...tags, val];
    onChange(tagsToHtml(newTags, type));
    setInputValue('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }

  if (!editing) {
    return (
      <div
        className="wf-tag-cell"
        onClick={() => setEditing(true)}
        title="Click to edit"
        style={isInspo ? { opacity: 0.5, filter: 'grayscale(70%)' } : undefined}
      >
        {tags.map((tag, i) => (
          <span
            key={i}
            className={type === 'who' ? `who-tag ${WHO_CLASS_MAP[tag.toLowerCase()] || 'who-treasurer'}` : 'sys-tag'}
          >
            {tag}
          </span>
        ))}
        {tags.length === 0 && <span className="wf-tag-empty">Click to add</span>}
      </div>
    );
  }

  return (
    <div className="wf-tag-edit" onBlur={(e) => {
      // Close editing when focus leaves the container entirely
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setEditing(false);
      }
    }}>
      <div className="wf-tag-list">
        {tags.map((tag, i) => (
          <span
            key={i}
            className={`wf-tag-pill ${type === 'who' ? `who-tag ${WHO_CLASS_MAP[tag.toLowerCase()] || 'who-treasurer'}` : 'sys-tag'}`}
          >
            {tag}
            <span className="wf-tag-remove" onClick={() => removeTag(i)}>x</span>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="wf-tag-input"
        placeholder={type === 'who' ? 'Add role...' : 'Add system...'}
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  );
}
