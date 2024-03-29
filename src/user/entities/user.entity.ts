import { Prisma } from '@prisma/client';

export class User implements Prisma.UserUncheckedCreateInput {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deletedAt?: string | Date;
  tasks?: Prisma.TaskUncheckedCreateNestedManyWithoutUserInput;
}
