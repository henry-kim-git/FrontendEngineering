import { describe, expect, it } from "vitest";
import { createEventFromDraft, getEventsForDate, updateEventFromDraft } from "@/src/planner/events";
import type { EventDraft, IsoDate, ScheduleEvent } from "@/src/planner/types";

const iso = (value: string) => value as IsoDate;

function makeEvent(overrides: Partial<ScheduleEvent> = {}): ScheduleEvent {
  return {
    id: "event_1",
    title: "제목",
    date: iso("2026-07-10"),
    startTime: "10:00",
    endTime: "11:00",
    category: "work",
    note: "",
    reminderAt: null,
    createdAt: "2026-07-01T00:00" as ScheduleEvent["createdAt"],
    updatedAt: "2026-07-01T00:00" as ScheduleEvent["updatedAt"],
    ...overrides
  };
}

describe("getEventsForDate", () => {
  it("해당 날짜의 일정만, 시작 시각 오름차순으로 반환한다", () => {
    const late = makeEvent({ id: "late", startTime: "14:00", endTime: "15:00" });
    const early = makeEvent({ id: "early", startTime: "09:00", endTime: "10:00" });
    const other = makeEvent({ id: "other", date: iso("2026-07-11") });
    const result = getEventsForDate([late, early, other], iso("2026-07-10"));
    expect(result.map((event) => event.id)).toEqual(["early", "late"]);
  });
});

describe("createEventFromDraft / updateEventFromDraft", () => {
  const draft: EventDraft = {
    title: "  새 일정  ",
    date: iso("2026-07-10"),
    startTime: "09:00",
    endTime: "10:00",
    category: "study",
    note: "  메모  ",
    reminderAt: null
  };

  it("초안의 앞뒤 공백을 제거하고 id를 부여한다", () => {
    const event = createEventFromDraft(draft);
    expect(event.title).toBe("새 일정");
    expect(event.note).toBe("메모");
    expect(event.id).toMatch(/^event_/);
  });

  it("기존 일정에 초안을 적용하면 id는 유지한다", () => {
    const original = makeEvent({ id: "keep-me" });
    const updated = updateEventFromDraft(original, { ...draft, title: "수정됨" });
    expect(updated.id).toBe("keep-me");
    expect(updated.title).toBe("수정됨");
  });
});
