import { describe, expect, it } from "vitest";
import { createTaskFromDraft, filterTasks, getTasksForDate, updateTaskFromDraft } from "@/src/planner/tasks";
import type { IsoDate, Task, TaskDraft } from "@/src/planner/types";

const iso = (value: string) => value as IsoDate;

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task_1",
    title: "제목",
    dueDate: iso("2026-07-10"),
    priority: "medium",
    done: false,
    note: "",
    reminderAt: null,
    createdAt: "2026-07-01T00:00" as Task["createdAt"],
    updatedAt: "2026-07-01T00:00" as Task["updatedAt"],
    ...overrides
  };
}

describe("getTasksForDate", () => {
  it("미완료 태스크를 완료 태스크보다 앞에 정렬한다", () => {
    const done = makeTask({ id: "a", done: true });
    const open = makeTask({ id: "b", done: false });
    const result = getTasksForDate([done, open], iso("2026-07-10"));
    expect(result.map((task) => task.id)).toEqual(["b", "a"]);
  });

  it("같은 완료 상태 내에서는 우선순위 높은 순으로 정렬한다", () => {
    const low = makeTask({ id: "low", priority: "low" });
    const high = makeTask({ id: "high", priority: "high" });
    const medium = makeTask({ id: "medium", priority: "medium" });
    const result = getTasksForDate([low, high, medium], iso("2026-07-10"));
    expect(result.map((task) => task.id)).toEqual(["high", "medium", "low"]);
  });

  it("날짜가 다른 태스크는 제외한다", () => {
    const other = makeTask({ id: "other", dueDate: iso("2026-07-11") });
    expect(getTasksForDate([other], iso("2026-07-10"))).toEqual([]);
  });
});

describe("filterTasks", () => {
  const selectedDate = iso("2026-07-10");
  const tasks = [
    makeTask({ id: "selected-open", dueDate: selectedDate, done: false }),
    makeTask({ id: "other-open", dueDate: iso("2026-07-11"), done: false }),
    makeTask({ id: "other-done", dueDate: iso("2026-07-11"), done: true })
  ];

  it("selected 필터는 선택한 날짜의 태스크만 반환한다", () => {
    expect(filterTasks(tasks, "selected", selectedDate).map((t) => t.id)).toEqual(["selected-open"]);
  });

  it("open 필터는 미완료 태스크만 반환한다", () => {
    expect(filterTasks(tasks, "open", selectedDate).map((t) => t.id).sort()).toEqual(["other-open", "selected-open"]);
  });

  it("done 필터는 완료된 태스크만 반환한다", () => {
    expect(filterTasks(tasks, "done", selectedDate).map((t) => t.id)).toEqual(["other-done"]);
  });

  it("all 필터는 전체를 반환한다", () => {
    expect(filterTasks(tasks, "all", selectedDate)).toHaveLength(3);
  });
});

describe("createTaskFromDraft / updateTaskFromDraft", () => {
  const draft: TaskDraft = {
    title: "  새 할 일  ",
    dueDate: iso("2026-07-10"),
    priority: "high",
    note: "  메모  ",
    reminderAt: null
  };

  it("초안의 앞뒤 공백을 제거하고 done: false, id를 부여한다", () => {
    const task = createTaskFromDraft(draft);
    expect(task.title).toBe("새 할 일");
    expect(task.note).toBe("메모");
    expect(task.done).toBe(false);
    expect(task.id).toMatch(/^task_/);
  });

  it("기존 태스크에 초안을 적용하면 id와 done은 유지한다", () => {
    const original = makeTask({ id: "keep-me", done: true });
    const updated = updateTaskFromDraft(original, { ...draft, title: "수정됨" });
    expect(updated.id).toBe("keep-me");
    expect(updated.done).toBe(true);
    expect(updated.title).toBe("수정됨");
  });
});
