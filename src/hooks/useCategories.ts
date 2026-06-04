import { useState, useCallback } from 'react';
import type { Category } from '@/types';
import { loadCategories, saveCategories } from '@/lib/storage';
import { generateId } from '@/lib/utils';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => loadCategories());

  const persist = useCallback((updated: Category[]) => {
    setCategories(updated);
    saveCategories(updated);
  }, []);

  const addCategory = useCallback((name: string, color: string) => {
    const newCat: Category = { id: generateId(), name, color };
    persist([...categories, newCat]);
  }, [categories, persist]);

  const deleteCategory = useCallback((id: string) => {
    persist(categories.filter(c => c.id !== id));
  }, [categories, persist]);

  return { categories, addCategory, deleteCategory };
}
