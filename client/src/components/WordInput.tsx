import React, { useState, FormEvent, ChangeEvent } from 'react';

interface WordInputProps {
  onSearch: (word: string) => void;
  loading?: boolean;
}

export const WordInput: React.FC<WordInputProps> = ({ onSearch, loading = false }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      onSearch(inputValue.trim());
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="search-container">
      <svg 
        className="search-icon" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        className="search-input"
        placeholder="Enter a word (e.g., Vlogger, Democracy, World)"
        value={inputValue}
        onChange={handleChange}
        disabled={loading}
        autoFocus
      />
      <button 
        type="submit" 
        className="search-button"
        disabled={!inputValue.trim() || loading}
      >
        {loading ? 'Tracing...' : 'Trace'}
      </button>
    </form>
  );
};
