export type Status = 'todo' | 'in-progress' | 'done';

export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  createdAt: Date;
};