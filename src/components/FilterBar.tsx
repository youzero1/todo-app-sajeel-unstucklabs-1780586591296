import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FilterType, SortType, Category } from '@/types';

type FilterBarProps = {
  filter: FilterType;
  sort: SortType;
  search: string;
  selectedCategory: string;
  categories: Category[];
  onFilterChange: (f: FilterType) => void;
  onSortChange: (s: SortType) => void;
  onSearchChange: (s: string) => void;
  onCategoryChange: (c: string) => void;
};

export default function FilterBar({
  filter, sort, search, selectedCategory, categories,
  onFilterChange, onSortChange, onSearchChange, onCategoryChange
}: FilterBarProps) {
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  const sorts: { label: string; value: SortType }[] = [
    { label: 'Newest', value: 'created' },
    { label: 'Due Date', value: 'dueDate' },
    { label: 'Priority', value: 'priority' },
    { label: 'A–Z', value: 'alphabetical' },
  ];

  return (
    <div className="space-y-3 mb-5">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          placeholder="Search tasks or tags..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Filter tabs */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                filter === f.value
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-1.5 ml-auto">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <select
            value={sort}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSortChange(e.target.value as SortType)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
          >
            {sorts.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
