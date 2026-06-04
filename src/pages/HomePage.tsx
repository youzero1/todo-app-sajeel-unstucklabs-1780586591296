import { CheckSquare, ToggleLeft } from 'lucide-react';
import AddTodoForm from '@/components/AddTodoForm';
import TodoItem from '@/components/TodoItem';
import FilterBar from '@/components/FilterBar';
import StatsBar from '@/components/StatsBar';
import EmptyState from '@/components/EmptyState';
import { useTodos } from '@/hooks/useTodos';
import { useCategories } from '@/hooks/useCategories';

export default function HomePage() {
  const {
    filteredTodos,
    filter, sort, search, selectedCategory, stats,
    setFilter, setSort, setSearch, setSelectedCategory,
    addTodo, toggleTodo, deleteTodo, editTodo,
    clearCompleted, toggleAll,
  } = useTodos();

  const { categories } = useCategories();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <CheckSquare size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">TaskFlow</h1>
          </div>
          {stats.total > 0 && (
            <button
              onClick={toggleAll}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium"
            >
              <ToggleLeft size={16} />
              Toggle All
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <AddTodoForm categories={categories} onAdd={addTodo} />

        {stats.total > 0 && (
          <StatsBar
            total={stats.total}
            completed={stats.completed}
            active={stats.active}
            onClearCompleted={clearCompleted}
          />
        )}

        <FilterBar
          filter={filter}
          sort={sort}
          search={search}
          selectedCategory={selectedCategory}
          categories={categories}
          onFilterChange={setFilter}
          onSortChange={setSort}
          onSearchChange={setSearch}
          onCategoryChange={setSelectedCategory}
        />

        {/* Todo list */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <EmptyState filter={filter} search={search} />
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                categories={categories}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </div>

        {filteredTodos.length > 0 && (
          <p className="text-center text-xs text-slate-400 mt-6">
            Showing {filteredTodos.length} of {stats.total} task{stats.total !== 1 ? 's' : ''}
          </p>
        )}
      </main>
    </div>
  );
}
