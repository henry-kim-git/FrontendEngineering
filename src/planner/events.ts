import { createId, nowLocalDateTime } from "@/src/planner/datetime";
import type { EventCategory, EventDraft, IsoDate, ScheduleEvent } from "@/src/planner/types";

/** `EventCategory` 값을 CSS 클래스 이름으로 매핑한다. */
export const EVENT_CATEGORY_CLASS: Record<EventCategory, string> = {
  work: "category-work",
  personal: "category-personal",
  study: "category-study",
  health: "category-health"
};

/** `EventCategory` 값을 표시용 한국어 레이블로 매핑한다. */
export const CATEGORY_LABEL: Record<EventCategory, string> = {
  work: "업무",
  personal: "개인",
  study: "학습",
  health: "건강"
};

/**
 * 특정 날짜에 해당하는 일정을 필터링하고 시작 시각 오름차순으로 정렬해 반환한다.
 * @param events 전체 일정 목록
 * @param date 조회할 날짜 (IsoDate)
 */
export function getEventsForDate(events: ScheduleEvent[], date: IsoDate): ScheduleEvent[] {
  return events
    .filter((event) => event.date === date)
    .sort((left, right) => `${left.startTime}-${left.endTime}`.localeCompare(`${right.startTime}-${right.endTime}`));
}

/**
 * `EventDraft`로부터 새 `ScheduleEvent` 객체를 생성한다. id·타임스탬프를 자동 부여한다.
 * @param draft 사용자가 입력한 일정 초안
 */
export function createEventFromDraft(draft: EventDraft): ScheduleEvent {
  const timestamp = nowLocalDateTime();
  return {
    id: createId("event"),
    title: draft.title.trim(),
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    category: draft.category,
    note: draft.note.trim(),
    reminderAt: draft.reminderAt,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

/**
 * 기존 `ScheduleEvent`에 `EventDraft`의 변경 내용을 적용한 새 객체를 반환한다. `updatedAt`을 갱신한다.
 * @param event 수정 대상 기존 일정
 * @param draft 사용자가 입력한 수정 내용
 */
export function updateEventFromDraft(event: ScheduleEvent, draft: EventDraft): ScheduleEvent {
  return {
    ...event,
    title: draft.title.trim(),
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    category: draft.category,
    note: draft.note.trim(),
    reminderAt: draft.reminderAt,
    updatedAt: nowLocalDateTime()
  };
}

/**
 * `ScheduleEvent`를 `EventDraft`로 변환한다. 편집 모달을 열 때 초기값으로 사용된다.
 * @param event 변환할 일정
 */
export function eventToDraft(event: ScheduleEvent): EventDraft {
  return {
    title: event.title,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    category: event.category,
    note: event.note ?? "",
    reminderAt: event.reminderAt
  };
}

/** 새 일정 작성 시 사용할 기본 `EventDraft`를 반환한다. */
export function makeDefaultEventDraft(date: IsoDate): EventDraft {
  return {
    title: "",
    date,
    startTime: "09:00",
    endTime: "10:00",
    category: "work",
    note: "",
    reminderAt: null
  };
}
