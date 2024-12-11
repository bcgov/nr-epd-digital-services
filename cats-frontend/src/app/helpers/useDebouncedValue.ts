import { useEffect, useState } from 'react';

const DEFAULT_DEBOUNCE_DELAY_MS = 300;

export default function useDebouncedValue<T>(
  inputValue: T,
  delay: number = DEFAULT_DEBOUNCE_DELAY_MS,
) {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);

  return debouncedValue;
}
