import { describe, expect, it } from "vitest";
import { taskModalReducer } from "@/src/hooks/taskModalReducer";
import type { TaskDraft } from "@/src/planner";

function makeDraft(overrides: Partial<TaskDraft> = {}): TaskDraft {
  return {
    title: "제목",
    dueDate: "2026-07-10" as TaskDraft["dueDate"],
    priority: "medium",
    note: "",
    reminderAt: null,
    ...overrides
  };
}

describe("taskModalReducer", () => {
  it("patch로 넘긴 필드만 갱신하고 나머지는 유지한다", () => {
    const state = makeDraft();
    const result = taskModalReducer(state, { type: "patch", patch: { title: "새 제목" } });
    expect(result.title).toBe("새 제목");
    expect(result.dueDate).toBe(state.dueDate);
    expect(result.priority).toBe(state.priority);
  });

  it("여러 필드를 한 번에 patch할 수 있다", () => {
    const state = makeDraft();
    const result = taskModalReducer(state, { type: "patch", patch: { title: "새 제목", priority: "high" } });
    expect(result.title).toBe("새 제목");
    expect(result.priority).toBe("high");
  });

  it("원본 상태 객체를 변경하지 않는다", () => {
    const state = makeDraft();
    taskModalReducer(state, { type: "patch", patch: { title: "새 제목" } });
    expect(state.title).toBe("제목");
  });
});
