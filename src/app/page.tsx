import type { Task } from '@/types/task';
import { getTasks } from './_actions/task-actions';
import { TaskDashboard } from './_components/task-dashboard';

export default async function Home() {
  const dbTasks = await getTasks();

  const tasks: Task[] = dbTasks.map((t) => ({
    ...t,
    status: t.status as Task['status'],
    priority: t.priority as Task['priority'],
  }));

  return <TaskDashboard tasks={tasks} />;
}
