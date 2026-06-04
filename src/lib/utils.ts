import { clsx, type ClassValue } from 'clsx';
import type { Priority, Todo, SortType } from '@/types';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function priorityWeight(priority: Priority): number {
  switch (priority) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
}

export function sortTodos(todos: Todo[], sort: SortType): Todo[] {
  return [...todos].sort((a, b) => {
    switch (sort) {
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        return priorityWeight(b.priority) - priorityWeight(a.priority);
      case 'alphabetical':
        return a.text.localeCompare(b.text);
      default:
        return 0;
    }
  });
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
