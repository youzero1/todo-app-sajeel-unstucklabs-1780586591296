export type Priority = 'low' | 'medium' | 'high';

export type FilterType = 'all' | 'active' | 'completed';

export type SortType = 'created' | 'dueDate' | 'priority' | 'alphabetical';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate: string | null;
  createdAt: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
