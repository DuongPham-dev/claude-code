import { randomUUID } from "node:crypto";

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly done: boolean;
  readonly createdAt: string;
}

export class TaskList {
  private readonly tasks: Task[] = [];

  add(title: string): Task {
    const task: Task = {
      id: randomUUID(),
      title,
      done: false,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(task);
    return { ...task };
  }

  list(): readonly Task[] {
    return this.tasks.map((task) => ({ ...task }));
  }
}
