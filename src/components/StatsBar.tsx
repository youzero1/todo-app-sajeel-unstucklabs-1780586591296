import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

type StatsBarProps = {
  total: number;
  completed: number;
  active: number;
  onClearCompleted: () => void;
};

export default function StatsBar({ total, completed, active, onClearCompleted }: StatsBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <ListTodo size={15} className="text-slate-400" />
            <span className="text-slate-500">Total</span>
            <span className="font-bold text-slate-700">{total}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Circle size={15} className="text-indigo-400" />
            <span className="text-slate-500">Active</span>
            <span className="font-bold text-indigo-600">{active}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <CheckCircle2 size={15} className="text-green-400" />
            <span className="text-slate-500">Done</span>
            <span className="font-bold text-green-600">{completed}</span>
          </div>
        </div>
        {completed > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium"
          >
            Clear completed
          </button>
        )}
      </div>
      {/* Progress bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1.5 text-right">{percent}% complete</p>
    </div>
  );
}
