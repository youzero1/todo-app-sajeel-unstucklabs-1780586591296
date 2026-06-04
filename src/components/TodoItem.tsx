import { useState } from 'react';
import { Check, Trash2, Pencil, Calendar, Tag, ChevronDown, ChevronUp, X, Save } from 'lucide-react';
import { cn, isOverdue, formatDate } from '@/lib/utils';
import type { Todo, Priority, Category } from '@/types';

type TodoItemProps = {
  todo: Todo;
  categories: Category[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
};

const PRIORITY_STYLES: Record<Priority, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const PRIORITY_DOT: Record<Priority, string> = {
  low: 'bg-green-400',
  medium: 'bg-yellow-400',
  high: 'bg-red-500',
};

export default function TodoItem({ todo, categories, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');
  const [editTagInput, setEditTagInput] = useState('');
  const [editTags, setEditTags] = useState<string[]>(todo.tags);

  const overdue = isOverdue(todo.dueDate) && !todo.completed;
  const categoryObj = categories.find(c => c.id === todo.category);

  const saveEdit = () => {
    if (!editText.trim()) return;
    onEdit(todo.id, {
      text: editText.trim(),
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate || null,
      tags: editTags,
    });
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditDueDate(todo.dueDate || '');
    setEditTags(todo.tags);
    setEditing(false);
  };

  const addEditTag = () => {
    const t = editTagInput.trim().toLowerCase();
    if (t && !editTags.includes(t)) setEditTags([...editTags, t]);
    setEditTagInput('');
  };

  return (
    <div className={cn(
      'bg-white rounded-xl border transition-all duration-200 hover:shadow-md',
      todo.completed ? 'border-slate-100 opacity-70' : overdue ? 'border-red-200' : 'border-slate-200'
    )}>
      <div className="flex items-center gap-3 p-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
            todo.completed
              ? 'bg-indigo-500 border-indigo-500 text-white'
              : 'border-slate-300 hover:border-indigo-400'
          )}
        >
          {todo.completed && <Check size={13} strokeWidth={3} />}
        </button>

        {/* Priority dot */}
        <span className={cn('flex-shrink-0 w-2 h-2 rounded-full', PRIORITY_DOT[todo.priority])} />

        {/* Text */}
        <span className={cn(
          'flex-1 text-sm font-medium',
          todo.completed ? 'line-through text-slate-400' : 'text-slate-700'
        )}>
          {todo.text}
        </span>

        {/* Meta chips */}
        <div className="hidden sm:flex items-center gap-2">
          {categoryObj && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: categoryObj.color + '20', color: categoryObj.color }}
            >
              {categoryObj.name}
            </span>
          )}
          <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', PRIORITY_STYLES[todo.priority])}>
            {todo.priority}
          </span>
          {todo.dueDate && (
            <span className={cn('text-xs flex items-center gap-1', overdue ? 'text-red-500' : 'text-slate-500')}>
              <Calendar size={11} />
              {formatDate(todo.dueDate)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setEditing(true); setExpanded(true); }}
            className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Expanded / Edit area */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100">
          {editing ? (
            <div className="space-y-3 mt-2">
              <input
                type="text"
                value={editText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <div className="flex flex-wrap gap-2">
                {(['low', 'medium', 'high'] as Priority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setEditPriority(p)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg border text-xs font-semibold capitalize transition-all',
                      editPriority === p
                        ? PRIORITY_STYLES[p]
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={editCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditCategory(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDueDate(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              {/* Tags edit */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editTagInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTagInput(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { e.preventDefault(); addEditTag(); } }}
                  placeholder="Add tag"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button type="button" onClick={addEditTag} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm transition-colors">Add</button>
              </div>
              {editTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {editTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                      #{tag}
                      <button type="button" onClick={() => setEditTags(editTags.filter(t => t !== tag))} className="text-indigo-400 hover:text-indigo-600">&times;</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                >
                  <Save size={14} /> Save
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              {/* Category + priority on mobile */}
              <div className="flex flex-wrap gap-2 sm:hidden">
                {categoryObj && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: categoryObj.color + '20', color: categoryObj.color }}
                  >
                    {categoryObj.name}
                  </span>
                )}
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium capitalize', PRIORITY_STYLES[todo.priority])}>
                  {todo.priority}
                </span>
                {todo.dueDate && (
                  <span className={cn('text-xs flex items-center gap-1', overdue ? 'text-red-500' : 'text-slate-500')}>
                    <Calendar size={11} />
                    {formatDate(todo.dueDate)}
                  </span>
                )}
              </div>
              {/* Tags */}
              {todo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <Tag size={12} className="text-slate-400" />
                  {todo.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">#{tag}</span>
                  ))}
                </div>
              )}
              {/* Created at */}
              <p className="text-xs text-slate-400">
                Created {formatDate(todo.createdAt)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
