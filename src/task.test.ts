import { Task, TaskFilter, TaskList, TaskNotFoundError } from "./task";

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

  it("does not validate the title", () => {
    const tasks = new TaskList();

    tasks.add("");

    expect(tasks.list()).toHaveLength(1);
  });
});

describe("TaskList viewing", () => {
  const makeTask = (id: string, title: string, done: boolean): Task => ({
    id,
    title,
    done,
    createdAt: `2026-10-20T00:00:0${id}.000Z`,
  });
  const seeded = () =>
    new TaskList([
      makeTask("1", "A", false),
      makeTask("2", "B", true),
      makeTask("3", "C", false),
    ]);
  const titles = (tasks: readonly Task[]) => tasks.map((t) => t.title);

  it("lists all tasks in creation order by default and for \"all\"", () => {
    expect(titles(seeded().list())).toEqual(["A", "B", "C"]);
    expect(titles(seeded().list("all"))).toEqual(["A", "B", "C"]);
  });

  it("lists only done tasks", () => {
    expect(titles(seeded().list("done"))).toEqual(["B"]);
  });

  it("lists only not-done tasks in creation order", () => {
    expect(titles(seeded().list("not-done"))).toEqual(["A", "C"]);
  });

  it("returns an empty result for an empty list under every filter", () => {
    const tasks = new TaskList();

    expect(tasks.list()).toEqual([]);
    expect(tasks.list("done")).toEqual([]);
    expect(tasks.list("not-done")).toEqual([]);
  });

  it("returns an empty result when no task matches the filter", () => {
    const tasks = new TaskList();
    tasks.add("A");

    expect(tasks.list("done")).toEqual([]);
  });

  it("rejects an unknown filter", () => {
    expect(() => seeded().list("bogus" as TaskFilter)).toThrow(/all, done, not-done/);
  });

  it("looks up a task by id", () => {
    expect(seeded().get("2")).toEqual(makeTask("2", "B", true));
  });

  it("throws a task not found error for an unknown or empty id", () => {
    const tasks = seeded();

    expect(() => tasks.get("missing")).toThrow(TaskNotFoundError);
    expect(() => tasks.get("missing")).toThrow(/missing/);
    expect(() => tasks.get("")).toThrow(TaskNotFoundError);
  });

  it("does not change the list when viewing or looking up", () => {
    const tasks = seeded();
    const before = tasks.list();

    tasks.list("done");
    tasks.list("not-done");
    tasks.get("1");
    const [first] = tasks.list();
    (first as { title: string }).title = "changed";
    tasks.get("1").title;

    expect(tasks.list()).toEqual(before);
    expect(tasks.get("1").title).toBe("A");
  });
});
