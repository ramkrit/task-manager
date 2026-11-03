'use client';

import { STATUS_LABELS, Task, TaskStatus } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const STATUS_STYLES: Record<TaskStatus, string> = {
  todo: 'bg-slate-200 text-slate-700',
  in_progress: 'bg-amber-200 text-amber-800',
  done: 'bg-green-200 text-green-800',
};

export default function TaskItem({
  task,
  onStatusChange,
  onDelete,
}: TaskItemProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`font-semibold ${
            task.status === 'done' ? 'line-through text-slate-400' : ''
          }`}
        >
          {task.title}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[task.status]}`}
        >
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-slate-600">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-2">
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value as TaskStatus)
          }
          className="border border-slate-300 rounded px-2 py-1 text-sm"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          onClick={() => onDelete(task.id)}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
