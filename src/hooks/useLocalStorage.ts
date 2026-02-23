import { useState, useEffect, useCallback } from 'react';
import { setEncryptedItem, getEncryptedItem } from '@/lib/encryption';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial value from storage or use default
  const getInitialValue = useCallback((): T => {
    const stored = getEncryptedItem<T>(key);
    return stored !== null ? stored : initialValue;
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  // Update storage when value changes
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      setEncryptedItem(key, newValue);
      return newValue;
    });
  }, [key]);

  // Sync with storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        const newValue = getEncryptedItem<T>(key);
        if (newValue !== null) {
          setStoredValue(newValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
