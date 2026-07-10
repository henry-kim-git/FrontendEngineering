import { addDays, nowLocalDateTime, todayIso } from "@/src/planner/datetime";
import { createEventNotification, createTaskNotification } from "@/src/planner/notifications";
import type { LocalDateTime, PlannerNotification, PlannerState, ScheduleEvent, Task } from "@/src/planner/types";

/**
 * 앱 첫 실행 시 사용할 시드 데이터가 포함된 초기 `PlannerState`를 생성한다.
 * 저장된 상태가 없을 때 폴백으로 사용된다.
 */
export function createInitialState(): PlannerState {
  const today = todayIso();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  const createdAt = nowLocalDateTime();

  const tasks: Task[] = [
    {
      id: "task_seed_1",
      title: "월간 회고 정리",
      dueDate: today,
      priority: "high",
      done: false,
      note: "",
      reminderAt: `${today}T16:00` as LocalDateTime,
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "task_seed_2",
      title: "다음 주 준비 항목 점검",
      dueDate: tomorrow,
      priority: "medium",
      done: false,
      note: "",
      reminderAt: `${tomorrow}T09:30` as LocalDateTime,
      createdAt,
      updatedAt: createdAt
    }
  ];

  const events: ScheduleEvent[] = [
    {
      id: "event_seed_1",
      title: "제품 회의",
      date: today,
      startTime: "10:00",
      endTime: "10:50",
      category: "work",
      note: "",
      reminderAt: `${today}T09:50` as LocalDateTime,
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "event_seed_2",
      title: "스터디",
      date: nextWeek,
      startTime: "20:00",
      endTime: "21:00",
      category: "study",
      note: "",
      reminderAt: `${nextWeek}T19:30` as LocalDateTime,
      createdAt,
      updatedAt: createdAt
    }
  ];

  return {
    tasks,
    events,
    notifications: [...tasks.map(createTaskNotification), ...events.map(createEventNotification)].filter(
      (notification): notification is PlannerNotification => notification !== null
    ),
    selectedDate: today,
    visibleMonth: today
  };
}
