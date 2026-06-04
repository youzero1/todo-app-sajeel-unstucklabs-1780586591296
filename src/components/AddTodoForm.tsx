import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Tag, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Priority, Category } from '@/types';

type AddTodoFormProps = {
  categories: Category[];
  onAdd: (text: string, priority: Priority, category: string, dueDate: string | null, tags: string[]) => void;
};

export default function AddTodoForm({ categories, onAdd }: AddTodoFormProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('personal');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority, category, dueDate || null, tags);
    setText('');
    setPriority('medium');
    setCategory('personal');
    setDueDate('');
    setTags([]);
    setTagInput('');
    setExpanded(false);
  };

  const handleAddTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const priorityColors: Record<Priority, string> = {
    low: 'bg-green-100 text-green-700 border-green-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    high: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
      <div className="flex gap-3 items-center">
        <button
          type="submit"
          className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center transition-colors shadow-sm"
        >
          <Plus size={20} />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 outline-none text-slate-700 placeholder-slate-400 text-base bg-transparent"
        />
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 gap-4">
          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Priority</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-xs font-semibold capitalize transition-all',
                    priority === p ? priorityColors[p] : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Category</label>
              <select
                value={category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide flex items-center gap-1">
                <Calendar size={12} /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide flex items-center gap-1">
              <Tag size={12} /> Tags
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={tagInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag and press Enter"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-indigo-400 hover:text-indigo-600 ml-0.5">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
