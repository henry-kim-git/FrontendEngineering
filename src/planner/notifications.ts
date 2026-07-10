import { addMinutes, compareDateTime, createId, nowLocalDateTime } from "@/src/planner/datetime";
import type { PlannerNotification, ScheduleEvent, Task } from "@/src/planner/types";

/**
 * 태스크의 `reminderAt`으로부터 알림 객체를 생성한다.
 * `reminderAt`이 null이면 `null`을 반환한다.
 * @param task 알림을 생성할 태스크
 * @returns 생성된 알림 또는 `null`
 */
export function createTaskNotification(task: Task): PlannerNotification | null {
  if (!task.reminderAt) {
    return null;
  }

  return {
    id: createId("notice"),
    sourceId: task.id,
    sourceType: "task",
    title: task.title,
    body: `${task.dueDate}까지 완료`,
    notifyAt: task.reminderAt,
    status: compareDateTime(task.reminderAt, nowLocalDateTime()) <= 0 ? "ready" : "scheduled",
    createdAt: nowLocalDateTime()
  };
}

/**
 * 일정의 `reminderAt`으로부터 알림 객체를 생성한다.
 * `reminderAt`이 null이면 `null`을 반환한다.
 * @param event 알림을 생성할 일정
 * @returns 생성된 알림 또는 `null`
 */
export function createEventNotification(event: ScheduleEvent): PlannerNotification | null {
  if (!event.reminderAt) {
    return null;
  }

  return {
    id: createId("notice"),
    sourceId: event.id,
    sourceType: "event",
    title: event.title,
    body: `${event.date} ${event.startTime}-${event.endTime}`,
    notifyAt: event.reminderAt,
    status: compareDateTime(event.reminderAt, nowLocalDateTime()) <= 0 ? "ready" : "scheduled",
    createdAt: nowLocalDateTime()
  };
}

/**
 * `scheduled` 상태인 알림 중 `notifyAt`이 현재 시각 이전인 것을 `ready`로 전환한다.
 * 이미 `ready` 또는 `read`인 알림은 변경하지 않는다.
 * @param notifications 갱신할 알림 목록
 * @returns 상태가 업데이트된 새 알림 배열
 */
export function refreshNotificationStatuses(notifications: PlannerNotification[]): PlannerNotification[] {
  const now = nowLocalDateTime();
  return notifications.map((notification) => {
    if (notification.status !== "scheduled") {
      return notification;
    }
    return compareDateTime(notification.notifyAt, now) <= 0 ? { ...notification, status: "ready" } : notification;
  });
}

/**
 * 알림을 지정한 분 만큼 미루고 상태를 `scheduled`로 되돌린다.
 * @param notification 스누즈할 알림
 * @param minutes 미룰 분 수
 * @returns 갱신된 새 알림 객체
 */
export function snoozeNotification(notification: PlannerNotification, minutes: number): PlannerNotification {
  return {
    ...notification,
    notifyAt: addMinutes(notification.notifyAt, minutes),
    status: "scheduled"
  };
}

export type NotificationFilter = "ready" | "scheduled" | "read" | "all";

export function filterNotifications(notifications: PlannerNotification[], filter: NotificationFilter): PlannerNotification[] {
  return notifications.filter((notification) => filter === "all" || notification.status === filter);
}

export function sortNotificationsByTime(notifications: PlannerNotification[]): PlannerNotification[] {
  return [...notifications].sort((left, right) => compareDateTime(left.notifyAt, right.notifyAt));
}
