import { describe, expect, it } from "vitest";
import { eventModalReducer } from "@/src/hooks/eventModalReducer";
import type { EventDraft } from "@/src/planner";

function makeDraft(overrides: Partial<EventDraft> = {}): EventDraft {
  return {
    title: "제목",
    date: "2026-07-10" as EventDraft["date"],
    startTime: "09:00",
    endTime: "10:00",
    category: "work",
    note: "",
    reminderAt: null,
    ...overrides
  };
}

describe("eventModalReducer", () => {
  it("patch로 넘긴 필드만 갱신하고 나머지는 유지한다", () => {
    const state = makeDraft();
    const result = eventModalReducer(state, { type: "patch", patch: { startTime: "11:00" } });
    expect(result.startTime).toBe("11:00");
    expect(result.endTime).toBe(state.endTime);
    expect(result.category).toBe(state.category);
  });

  it("여러 필드를 한 번에 patch할 수 있다", () => {
    const state = makeDraft();
    const result = eventModalReducer(state, { type: "patch", patch: { startTime: "11:00", endTime: "12:00" } });
    expect(result.startTime).toBe("11:00");
    expect(result.endTime).toBe("12:00");
  });

  it("원본 상태 객체를 변경하지 않는다", () => {
    const state = makeDraft();
    eventModalReducer(state, { type: "patch", patch: { title: "새 제목" } });
    expect(state.title).toBe("제목");
  });
});
