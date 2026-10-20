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
    const trimmed = typeof title === "string" ? title.trim() : "";
    if (trimmed === "") {
      throw new Error("Title is required");
    }
    const task: Task = {
      id: randomUUID(),
      title: trimmed,
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
