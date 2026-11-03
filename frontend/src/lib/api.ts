import { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from './types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...options,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export const tasksApi = {
  list(status?: TaskStatus): Promise<Task[]> {
    const query = status ? `?status=${status}` : '';
    return request<Task[]>(`/tasks${query}`);
  },
  create(input: CreateTaskInput): Promise<Task> {
    return request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  update(id: string, input: UpdateTaskInput): Promise<Task> {
    return request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  remove(id: string): Promise<void> {
    return request<void>(`/tasks/${id}`, { method: 'DELETE' });
  },
};
