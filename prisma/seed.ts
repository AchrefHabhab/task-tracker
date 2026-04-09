import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.task.count();
  if (count > 0) {
    console.log(`Database already has ${count} tasks, skipping seed.`);
    return;
  }

  await prisma.task.createMany({
    data: [
      {
        title: 'Learn Next.js App Router',
        status: 'in-progress',
        priority: 'high',
      },
      {
        title: 'Build Task Tracker UI',
        status: 'todo',
        priority: 'medium',
      },
      {
        title: 'Set up project structure',
        status: 'done',
        priority: 'high',
      },
    ],
  });

  console.log('Seeded 3 initial tasks.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
