import type { Todo, Category } from '@/types';

const TODOS_KEY = 'todo-app-todos';
const CATEGORIES_KEY = 'todo-app-categories';

export function loadTodos(): Todo[] {
  try {
    const data = localStorage.getItem(TODOS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

export function loadCategories(): Category[] {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return [
    { id: 'personal', name: 'Personal', color: '#6366f1' },
    { id: 'work', name: 'Work', color: '#f59e0b' },
    { id: 'shopping', name: 'Shopping', color: '#22c55e' },
    { id: 'health', name: 'Health', color: '#ef4444' },
  ];
}

export function saveCategories(categories: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}
