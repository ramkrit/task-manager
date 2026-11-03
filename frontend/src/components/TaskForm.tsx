'use client';

import { useState } from 'react';
import { CreateTaskInput } from '@/lib/types';

interface TaskFormProps {
  onCreate: (input: CreateTaskInput) => Promise<void>;
}

export default function TaskForm({ onCreate }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-4 flex flex-col gap-3"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={200}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
        maxLength={2000}
      />
      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="bg-blue-600 text-white rounded px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed self-start"
      >
        {submitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
}
