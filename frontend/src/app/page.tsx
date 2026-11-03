'use client';

import { useEffect, useState } from 'react';
import { tasksApi } from '@/lib/api';
import {
  CreateTaskInput,
  STATUS_LABELS,
  Task,
  TaskStatus,
} from '@/lib/types';
import TaskForm from '@/components/TaskForm';
import TaskItem from '@/components/TaskItem';

type Filter = 'all' | TaskStatus;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.list();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreate = async (input: CreateTaskInput) => {
    const created = await tasksApi.create(input);
    setTasks((prev) => [created, ...prev]);
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    const updated = await tasksApi.update(id, { status });
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: string) => {
    await tasksApi.remove(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const visibleTasks =
    filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const filters: Filter[] = ['all', 'todo', 'in_progress', 'done'];

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Task Manager</h1>

      <TaskForm onCreate={handleCreate} />

      <div className="flex gap-2 mt-6 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-300'
            }`}
          >
            {f === 'all' ? 'All' : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {loading && <p className="text-slate-500">Loading tasks...</p>}
      {error && (
        <div className="bg-red-100 text-red-700 rounded p-3 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && visibleTasks.length === 0 && (
        <p className="text-slate-500">No tasks yet. Add one above.</p>
      )}

      <div className="flex flex-col gap-3">
        {visibleTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </main>
  );
}
