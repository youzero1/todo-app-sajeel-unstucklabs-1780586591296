import { useState, useCallback } from 'react';
import type { Todo, Priority, FilterType, SortType } from '@/types';
import { loadTodos, saveTodos } from '@/lib/storage';
import { generateId, sortTodos } from '@/lib/utils';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('created');
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const persist = useCallback((updated: Todo[]) => {
    setTodos(updated);
    saveTodos(updated);
  }, []);

  const addTodo = useCallback((text: string, priority: Priority, category: string, dueDate: string | null, tags: string[]) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      priority,
      category,
      dueDate,
      createdAt: new Date().toISOString(),
      tags,
    };
    persist([...todos, newTodo]);
  }, [todos, persist]);

  const toggleTodo = useCallback((id: string) => {
    persist(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, [todos, persist]);

  const deleteTodo = useCallback((id: string) => {
    persist(todos.filter(t => t.id !== id));
  }, [todos, persist]);

  const editTodo = useCallback((id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    persist(todos.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [todos, persist]);

  const clearCompleted = useCallback(() => {
    persist(todos.filter(t => !t.completed));
  }, [todos, persist]);

  const toggleAll = useCallback(() => {
    const allCompleted = todos.every(t => t.completed);
    persist(todos.map(t => ({ ...t, completed: !allCompleted })));
  }, [todos, persist]);

  const filteredTodos = sortTodos(
    todos.filter(todo => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);
      const matchesCategory = selectedCategory === 'all' || todo.category === selectedCategory;
      const matchesSearch = search === '' || todo.text.toLowerCase().includes(search.toLowerCase()) ||
        todo.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      return matchesFilter && matchesCategory && matchesSearch;
    }),
    sort
  );

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  };

  return {
    todos,
    filteredTodos,
    filter,
    sort,
    search,
    selectedCategory,
    stats,
    setFilter,
    setSort,
    setSearch,
    setSelectedCategory,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    toggleAll,
  };
}
