'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import type { Status, Priority } from '@/types/task';

export async function getTasks() {
  return db.task.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createTask(title: string, priority: Priority) {
  await db.task.create({
    data: { title, priority },
  });
  revalidatePath('/');
}

export async function deleteTask(id: string) {
  await db.task.delete({
    where: { id },
  });
  revalidatePath('/');
}

export async function restoreTask(title: string, priority: Priority, status: Status) {
  await db.task.create({
    data: { title, priority, status },
  });
  revalidatePath('/');
}

export async function updateTaskStatus(id: string, status: Status) {
  await db.task.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/');
}

export async function updateTask(
  id: string,
  data: { title: string; status: Status; priority: Priority }
) {
  await db.task.update({
    where: { id },
    data,
  });
  revalidatePath('/');
}
