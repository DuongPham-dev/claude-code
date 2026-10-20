import { randomUUID } from "node:crypto";

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly done: boolean;
  readonly createdAt: string;
}

export type TaskFilter = "all" | "done" | "not-done";

const TASK_FILTERS: readonly TaskFilter[] = ["all", "done", "not-done"];

export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`Task not found: ${id}`);
    this.name = "TaskNotFoundError";
  }
}

export class TaskList {
  private readonly tasks: Task[];

  constructor(initial: readonly Task[] = []) {
    this.tasks = initial.map((task) => ({ ...task }));
  }

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

  list(filter: TaskFilter = "all"): readonly Task[] {
    if (!TASK_FILTERS.includes(filter)) {
      throw new Error(
        `Unknown filter "${filter}"; expected one of: ${TASK_FILTERS.join(", ")}`,
      );
    }
    return this.tasks
      .filter((task) => filter === "all" || task.done === (filter === "done"))
      .map((task) => ({ ...task }));
  }

  get(id: string): Task {
    const task = this.tasks.find((candidate) => candidate.id === id);
    if (!task) {
      throw new TaskNotFoundError(id);
    }
    return { ...task };
  }
}
