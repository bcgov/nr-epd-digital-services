import { useEffect, useState } from 'react';
import useDebouncedValue from '../../../helpers/useDebouncedValue';
import './ApplicationsV2SearchInput.css';

const SEARCH_DEBOUNCE_MS = 300;

export type ApplicationsV2SearchInputProps = {
  search: string;
  onSearchChange: (search: string) => void;
};

export function ApplicationsV2SearchInput({
  search,
  onSearchChange,
}: ApplicationsV2SearchInputProps) {
  const [inputValue, setInputValue] = useState(search);
  const debouncedValue = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  useEffect(() => {
    if (debouncedValue !== search) {
      onSearchChange(debouncedValue);
    }
  }, [debouncedValue, onSearchChange, search]);

  return (
    <input
      type="search"
      className="applications-v2-search-input"
      aria-label="Search applications"
      placeholder="Search applications"
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
    />
  );
}
