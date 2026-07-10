import { describe, expect, it } from "vitest";
import { createCalendarDayViewModels, createMonthGrid, createWeekDays } from "@/src/planner/grid";
import type { IsoDate, ScheduleEvent, Task } from "@/src/planner/types";

const iso = (value: string) => value as IsoDate;

describe("createMonthGrid", () => {
  it("항상 42칸(6행 x 7열)을 반환한다", () => {
    expect(createMonthGrid(iso("2026-07-01"), iso("2026-07-10"))).toHaveLength(42);
  });

  it("월의 앞뒤를 이전/다음 달 날짜로 채운다", () => {
    // 2026년 7월 1일은 수요일이므로 앞에 일~화 3칸이 6월 날짜로 채워진다
    const grid = createMonthGrid(iso("2026-07-01"), iso("2026-07-10"));
    expect(grid[0].isCurrentMonth).toBe(false);
    expect(grid.some((day) => day.date === "2026-07-01" && day.isCurrentMonth)).toBe(true);
  });

  it("today와 일치하는 칸만 isToday: true다", () => {
    const grid = createMonthGrid(iso("2026-07-01"), iso("2026-07-10"));
    const todayCells = grid.filter((day) => day.isToday);
    expect(todayCells).toHaveLength(1);
    expect(todayCells[0].date).toBe("2026-07-10");
  });
});

describe("createWeekDays", () => {
  it("일요일부터 토요일까지 7일을 반환한다", () => {
    const days = createWeekDays(iso("2026-07-10"), iso("2026-07-10"));
    expect(days).toHaveLength(7);
    expect(days[0].date).toBe("2026-07-05");
    expect(days[6].date).toBe("2026-07-11");
  });
});

describe("createCalendarDayViewModels", () => {
  const date = iso("2026-07-10");

  function makeTask(id: string, done = false): Task {
    return {
      id,
      title: id,
      dueDate: date,
      priority: "medium",
      done,
      note: "",
      reminderAt: null,
      createdAt: "2026-07-01T00:00" as Task["createdAt"],
      updatedAt: "2026-07-01T00:00" as Task["updatedAt"]
    };
  }

  function makeEvent(id: string): ScheduleEvent {
    return {
      id,
      title: id,
      date,
      startTime: "09:00",
      endTime: "10:00",
      category: "work",
      note: "",
      reminderAt: null,
      createdAt: "2026-07-01T00:00" as ScheduleEvent["createdAt"],
      updatedAt: "2026-07-01T00:00" as ScheduleEvent["updatedAt"]
    };
  }

  it("완료된 태스크는 숨겨진 개수에 포함하지 않는다", () => {
    const tasks = [makeTask("done", true)];
    const [day] = createCalendarDayViewModels(date, date, date, tasks, []).filter((d) => d.date === date);
    expect(day.visibleTasks).toHaveLength(0);
    expect(day.hiddenCount).toBe(0);
  });

  it("이벤트+태스크 합이 3개를 넘으면 hiddenCount로 나머지를 센다", () => {
    const events = [makeEvent("e1"), makeEvent("e2"), makeEvent("e3")];
    const tasks = [makeTask("t1"), makeTask("t2")];
    const [day] = createCalendarDayViewModels(date, date, date, tasks, events).filter((d) => d.date === date);
    expect(day.visibleEvents).toHaveLength(3);
    expect(day.visibleTasks).toHaveLength(0);
    expect(day.hiddenCount).toBe(2);
  });

  it("selectedDate와 같은 날은 isSelected: true, className에 is-selected가 붙는다", () => {
    const [day] = createCalendarDayViewModels(date, date, date, [], []).filter((d) => d.date === date);
    expect(day.isSelected).toBe(true);
    expect(day.className).toContain("is-selected");
  });
});
