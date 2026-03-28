import { useState } from 'react';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  onChangeText: (text: string) => void;
}

export default function SearchBox({ onChangeText }: SearchBoxProps) {
  const [searchText, setSearchText] = useState<string>(() => {
    const savedSearchText = localStorage.getItem('searchText');
    return savedSearchText ? JSON.parse(savedSearchText) : '';
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();

    setSearchText(text);
    localStorage.setItem('searchText', JSON.stringify(text));
    onChangeText(text);
  };

  return (
    <input
      className={css.input}
      type="text"
      onChange={handleChange}
      value={searchText}
      placeholder="Search notes"
    />
  );
}
