import { ClipboardList } from 'lucide-react';
import type { FilterType } from '@/types';

type EmptyStateProps = {
  filter: FilterType;
  search: string;
};

export default function EmptyState({ filter, search }: EmptyStateProps) {
  let message = 'No tasks yet. Add one above!';
  if (search) {
    message = `No tasks matching "${search}"}`;
  } else if (filter === 'active') {
    message = 'No active tasks. Great job!';
  } else if (filter === 'completed') {
    message = 'No completed tasks yet.';
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <ClipboardList size={28} className="text-slate-400" />
      </div>
      <p className="text-slate-500 text-sm font-medium">{message}</p>
    </div>
  );
}
