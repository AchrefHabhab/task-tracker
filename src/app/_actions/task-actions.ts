'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getSessionId } from '@/lib/session';
import type { Status, Priority } from '@/types/task';

export async function getTasks() {
  const sessionId = await getSessionId();

  const tasks = await db.task.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' },
  });

  return tasks;
}

export async function createTask(title: string, priority: Priority) {
  const sessionId = await getSessionId();
  await db.task.create({
    data: { title, priority, sessionId },
  });
  revalidatePath('/');
}

export async function deleteTask(id: string) {
  const sessionId = await getSessionId();
  await db.task.delete({
    where: { id, sessionId },
  });
  revalidatePath('/');
}

export async function restoreTask(title: string, priority: Priority, status: Status) {
  const sessionId = await getSessionId();
  await db.task.create({
    data: { title, priority, status, sessionId },
  });
  revalidatePath('/');
}

export async function updateTaskStatus(id: string, status: Status) {
  const sessionId = await getSessionId();
  await db.task.update({
    where: { id, sessionId },
    data: { status },
  });
  revalidatePath('/');
}

export async function updateTask(
  id: string,
  data: { title: string; status: Status; priority: Priority }
) {
  const sessionId = await getSessionId();
  await db.task.update({
    where: { id, sessionId },
    data,
  });
  revalidatePath('/');
}
