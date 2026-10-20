import { TaskList } from "./task";

describe("TaskList", () => {
  it("starts empty", () => {
    expect(new TaskList().list()).toEqual([]);
  });

  it("stores a task with an id, title, not-done status and creation time", () => {
    const tasks = new TaskList();

    tasks.add("Buy milk");
    const [task] = tasks.list();

    expect(typeof task.id).toBe("string");
    expect(task.id.length).toBeGreaterThan(0);
    expect(task.title).toBe("Buy milk");
    expect(task.done).toBe(false);
    expect(new Date(task.createdAt).toISOString()).toBe(task.createdAt);
  });

  it("returns the created task from add", () => {
    const tasks = new TaskList();

    const created = tasks.add("Buy milk");

    expect(tasks.list()).toEqual([created]);
  });

  it("gives different tasks different ids", () => {
    const tasks = new TaskList();

    const a = tasks.add("A");
    const b = tasks.add("B");

    expect(a.id).not.toBe(b.id);
  });

  it("keeps tasks in the order they were added", () => {
    const tasks = new TaskList();

    tasks.add("A");
    tasks.add("B");
    tasks.add("C");

    expect(tasks.list().map((t) => t.title)).toEqual(["A", "B", "C"]);
  });

  it("does not let callers change the stored list through the returned array", () => {
    const tasks = new TaskList();
    tasks.add("A");

    const list = tasks.list() as ReturnType<TaskList["list"]> & unknown[];
    list.push({ id: "x", title: "X", done: false, createdAt: "" });
    list.reverse();

    expect(tasks.list().map((t) => t.title)).toEqual(["A"]);
  });

  it("does not let callers change a stored task through a returned task", () => {
    const tasks = new TaskList();
    const created = tasks.add("A");

    (created as { title: string }).title = "changed";
    (tasks.list()[0] as { done: boolean }).done = true;

    expect(tasks.list()[0].title).toBe("A");
    expect(tasks.list()[0].done).toBe(false);
  });

  it("keeps separate lists independent", () => {
    const first = new TaskList();
    const second = new TaskList();

    first.add("A");

    expect(second.list()).toEqual([]);
  });

  it("ignores leading and trailing whitespace in the title", () => {
    const tasks = new TaskList();

    expect(tasks.add("  Buy milk  ").title).toBe("Buy milk");
    expect(tasks.add("\t\nBuy eggs\n").title).toBe("Buy eggs");
    expect(tasks.add("Buy  bread").title).toBe("Buy  bread");
    expect(tasks.list().map((t) => t.title)).toEqual([
      "Buy milk",
      "Buy eggs",
      "Buy  bread",
    ]);
  });

  it.each(["", "   ", "\t\n"])("rejects the empty title %j", (title) => {
    const tasks = new TaskList();

    expect(() => tasks.add(title)).toThrow("Title is required");
    expect(tasks.list()).toEqual([]);
  });

  it("rejects a title that is not a string", () => {
    const tasks = new TaskList();

    expect(() => tasks.add(undefined as unknown as string)).toThrow(
      "Title is required",
    );
    expect(tasks.list()).toEqual([]);
  });

  it("keeps two tasks with the same title as separate tasks", () => {
    const tasks = new TaskList();

    const first = tasks.add("Buy milk");
    const second = tasks.add("Buy milk");

    expect(tasks.list()).toHaveLength(2);
    expect(first.id).not.toBe(second.id);
  });

  it("returns the new task including its identifier", () => {
    const tasks = new TaskList();

    const created = tasks.add("Buy milk");

    expect(created.id.length).toBeGreaterThan(0);
    expect(tasks.list()).toEqual([created]);
  });
});
