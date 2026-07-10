import { describe, expect, it } from "vitest";
import { addMinutes, nowLocalDateTime } from "@/src/planner/datetime";
import { createEventNotification, createTaskNotification, refreshNotificationStatuses, snoozeNotification } from "@/src/planner/notifications";
import type { PlannerNotification, ScheduleEvent, Task } from "@/src/planner/types";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task_1",
    title: "제목",
    dueDate: "2026-07-10" as Task["dueDate"],
    priority: "medium",
    done: false,
    note: "",
    reminderAt: null,
    createdAt: "2026-07-01T00:00" as Task["createdAt"],
    updatedAt: "2026-07-01T00:00" as Task["updatedAt"],
    ...overrides
  };
}

function makeEvent(overrides: Partial<ScheduleEvent> = {}): ScheduleEvent {
  return {
    id: "event_1",
    title: "제목",
    date: "2026-07-10" as ScheduleEvent["date"],
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

describe("createTaskNotification", () => {
  it("reminderAt이 없으면 null을 반환한다", () => {
    expect(createTaskNotification(makeTask({ reminderAt: null }))).toBeNull();
  });

  it("reminderAt이 미래면 scheduled 상태로 생성한다", () => {
    const future = addMinutes(nowLocalDateTime(), 60);
    const notification = createTaskNotification(makeTask({ reminderAt: future }));
    expect(notification?.status).toBe("scheduled");
    expect(notification?.sourceType).toBe("task");
  });

  it("reminderAt이 과거면 ready 상태로 생성한다", () => {
    const past = addMinutes(nowLocalDateTime(), -60);
    const notification = createTaskNotification(makeTask({ reminderAt: past }));
    expect(notification?.status).toBe("ready");
  });
});

describe("createEventNotification", () => {
  it("reminderAt이 없으면 null을 반환한다", () => {
    expect(createEventNotification(makeEvent({ reminderAt: null }))).toBeNull();
  });

  it("reminderAt이 미래면 scheduled 상태로 생성한다", () => {
    const future = addMinutes(nowLocalDateTime(), 60);
    const notification = createEventNotification(makeEvent({ reminderAt: future }));
    expect(notification?.status).toBe("scheduled");
    expect(notification?.sourceType).toBe("event");
  });
});

describe("refreshNotificationStatuses", () => {
  function makeNotification(overrides: Partial<PlannerNotification> = {}): PlannerNotification {
    return {
      id: "notice_1",
      sourceId: "task_1",
      sourceType: "task",
      title: "제목",
      body: "",
      notifyAt: nowLocalDateTime(),
      status: "scheduled",
      createdAt: nowLocalDateTime(),
      ...overrides
    };
  }

  it("scheduled 상태이고 notifyAt이 지났으면 ready로 바꾼다", () => {
    const past = addMinutes(nowLocalDateTime(), -10);
    const [result] = refreshNotificationStatuses([makeNotification({ notifyAt: past, status: "scheduled" })]);
    expect(result.status).toBe("ready");
  });

  it("이미 read 상태면 변경하지 않는다", () => {
    const past = addMinutes(nowLocalDateTime(), -10);
    const [result] = refreshNotificationStatuses([makeNotification({ notifyAt: past, status: "read" })]);
    expect(result.status).toBe("read");
  });

  it("아직 도래하지 않은 scheduled 알림은 그대로 둔다", () => {
    const future = addMinutes(nowLocalDateTime(), 10);
    const [result] = refreshNotificationStatuses([makeNotification({ notifyAt: future, status: "scheduled" })]);
    expect(result.status).toBe("scheduled");
  });
});

describe("snoozeNotification", () => {
  it("notifyAt을 지정한 분만큼 미루고 상태를 scheduled로 되돌린다", () => {
    const notifyAt = "2026-07-10T09:00" as PlannerNotification["notifyAt"];
    const notification: PlannerNotification = {
      id: "notice_1",
      sourceId: "task_1",
      sourceType: "task",
      title: "제목",
      body: "",
      notifyAt,
      status: "ready",
      createdAt: notifyAt
    };
    const result = snoozeNotification(notification, 10);
    expect(result.notifyAt).toBe("2026-07-10T09:10");
    expect(result.status).toBe("scheduled");
  });
});
