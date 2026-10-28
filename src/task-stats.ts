import { Task } from "./task";

// NOTE: intentionally sloppy sample, used to exercise code review.

export function parseTasks(json: string): Task[] {
  // no try/catch: invalid JSON throws an unhandled SyntaxError
  const data = JSON.parse(json) as any;
  return data.tasks;
}

export function completionRate(tasks: Task[]): number {
  // empty list => 0 / 0 = NaN
  const done = tasks.filter((t) => t.done).length;
  return (done / tasks.length) * 100;
}

export function findByTitle(tasks: Task[], title: string): Task {
  // returns undefined at runtime when nothing matches, typed as Task
  return tasks.find((t) => t.title == title) as Task;
}

export function longestTitle(tasks: Task[]): string {
  // crashes on empty list: reduce without initial value
  return tasks.reduce((a, b) => (a.title.length >= b.title.length ? a : b)).title;
}

export function groupByDay(tasks: Task[]): any {
  const result: any = {};
  for (let i = 0; i < tasks.length; i++) {
    const day = tasks[i].createdAt.slice(0, 10);
    result[day] = (result[day] || 0) + 1;
  }
  return result;
}

export function markDone(task: Task): Task {
  // mutates a readonly field by casting
  (task as any).done = true;
  return task;
}
