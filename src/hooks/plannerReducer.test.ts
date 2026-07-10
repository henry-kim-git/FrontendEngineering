import { describe, expect, it } from "vitest";
import { plannerReducer } from "@/src/hooks/plannerReducer";
import { createInitialState } from "@/src/planner";
import type { EventDraft, PlannerState, TaskDraft } from "@/src/planner";

function emptyState(): PlannerState {
  const base = createInitialState();
  return { ...base, tasks: [], events: [], notifications: [] };
}

describe("plannerReducer", () => {
  it("addTask는 태스크와 알림을 추가하고 선택 날짜를 마감일로 옮긴다", () => {
    const draft: TaskDraft = {
      title: "새 할 일",
      dueDate: "2026-08-01" as TaskDraft["dueDate"],
      priority: "high",
      note: "",
      reminderAt: "2026-08-01T09:00" as TaskDraft["reminderAt"]
    };
    const result = plannerReducer(emptyState(), { type: "addTask", draft });
    expect(result?.tasks).toHaveLength(1);
    expect(result?.notifications).toHaveLength(1);
    expect(result?.selectedDate).toBe("2026-08-01");
  });

  it("updateTask는 해당 id의 태스크만 교체하고 존재하지 않으면 상태를 그대로 둔다", () => {
    const state = plannerReducer(emptyState(), {
      type: "addTask",
      draft: { title: "원본", dueDate: "2026-08-01" as TaskDraft["dueDate"], priority: "low", note: "", reminderAt: null }
    })!;
    const taskId = state.tasks[0].id;

    const updated = plannerReducer(state, {
      type: "updateTask",
      id: taskId,
      draft: { title: "수정됨", dueDate: "2026-08-02" as TaskDraft["dueDate"], priority: "medium", note: "", reminderAt: null }
    });
    expect(updated?.tasks[0].title).toBe("수정됨");

    const noop = plannerReducer(state, {
      type: "updateTask",
      id: "missing",
      draft: { title: "무시됨", dueDate: "2026-08-02" as TaskDraft["dueDate"], priority: "medium", note: "", reminderAt: null }
    });
    expect(noop).toBe(state);
  });

  it("toggleTask는 done 값을 반전한다", () => {
    const state = plannerReducer(emptyState(), {
      type: "addTask",
      draft: { title: "할 일", dueDate: "2026-08-01" as TaskDraft["dueDate"], priority: "low", note: "", reminderAt: null }
    })!;
    const taskId = state.tasks[0].id;
    const toggled = plannerReducer(state, { type: "toggleTask", id: taskId });
    expect(toggled?.tasks[0].done).toBe(true);
  });

  it("deleteTask는 태스크와 관련 알림을 함께 제거한다", () => {
    const state = plannerReducer(emptyState(), {
      type: "addTask",
      draft: {
        title: "할 일",
        dueDate: "2026-08-01" as TaskDraft["dueDate"],
        priority: "low",
        note: "",
        reminderAt: "2026-08-01T09:00" as TaskDraft["reminderAt"]
      }
    })!;
    const taskId = state.tasks[0].id;
    const deleted = plannerReducer(state, { type: "deleteTask", id: taskId });
    expect(deleted?.tasks).toHaveLength(0);
    expect(deleted?.notifications).toHaveLength(0);
  });

  it("addEvent / deleteEvent도 동일하게 동작한다", () => {
    const draft: EventDraft = {
      title: "새 일정",
      date: "2026-08-01" as EventDraft["date"],
      startTime: "09:00",
      endTime: "10:00",
      category: "work",
      note: "",
      reminderAt: null
    };
    const withEvent = plannerReducer(emptyState(), { type: "addEvent", draft });
    expect(withEvent?.events).toHaveLength(1);

    const eventId = withEvent!.events[0].id;
    const withoutEvent = plannerReducer(withEvent, { type: "deleteEvent", id: eventId });
    expect(withoutEvent?.events).toHaveLength(0);
  });

  it("markNotificationRead / snoozeNotification이 상태를 갱신한다", () => {
    const state = plannerReducer(emptyState(), {
      type: "addTask",
      draft: {
        title: "할 일",
        dueDate: "2026-08-01" as TaskDraft["dueDate"],
        priority: "low",
        note: "",
        reminderAt: "2026-08-01T09:00" as TaskDraft["reminderAt"]
      }
    })!;
    const notificationId = state.notifications[0].id;

    const read = plannerReducer(state, { type: "markNotificationRead", id: notificationId });
    expect(read?.notifications[0].status).toBe("read");

    const snoozed = plannerReducer(state, { type: "snoozeNotification", id: notificationId, minutes: 30 });
    expect(snoozed?.notifications[0].status).toBe("scheduled");
  });

  it("state가 undefined이면 항상 undefined를 반환한다 (replace 제외)", () => {
    expect(plannerReducer(undefined, { type: "refreshNotifications" })).toBeUndefined();
  });
});
