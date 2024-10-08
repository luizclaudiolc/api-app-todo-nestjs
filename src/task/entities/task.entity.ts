import { Prisma } from '@prisma/client';

export class Task implements Prisma.TaskUncheckedCreateInput {
  id?: string;
  title: string;
  description: string;
  isDone?: boolean;
  userId: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
