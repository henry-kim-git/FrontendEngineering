import { createId, formatDate, nowLocalDateTime } from "@/src/planner/datetime";
import type { IsoDate, Priority, Task, TaskDraft } from "@/src/planner/types";

/** `EventCategory`와 짝을 이루는 우선순위별 CSS 클래스 이름 매핑. */
export const TASK_PRIORITY_CLASS: Record<Priority, string> = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low"
};

/** `Priority` 값을 표시용 한국어 레이블로 매핑한다. */
export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음"
};

/**
 * 우선순위를 정렬 가중치 숫자로 변환한다. high=3, medium=2, low=1.
 * @param priority 우선순위
 */
function priorityWeight(priority: Priority): number {
  if (priority === "high") {
    return 3;
  }
  if (priority === "medium") {
    return 2;
  }
  return 1;
}

/**
 * 특정 날짜에 해당하는 태스크를 필터링하고 정렬해 반환한다.
 * 미완료 태스크가 앞에, 같은 완료 상태 내에서는 우선순위 높은 순으로 정렬한다.
 * @param tasks 전체 태스크 목록
 * @param date 조회할 날짜 (IsoDate)
 */
export function getTasksForDate(tasks: Task[], date: IsoDate): Task[] {
  return tasks
    .filter((task) => task.dueDate === date)
    .sort((left, right) => Number(left.done) - Number(right.done) || priorityWeight(right.priority) - priorityWeight(left.priority));
}

/**
 * `TaskDraft`로부터 새 `Task` 객체를 생성한다. id·타임스탬프를 자동 부여한다.
 * @param draft 사용자가 입력한 태스크 초안
 */
export function createTaskFromDraft(draft: TaskDraft): Task {
  const timestamp = nowLocalDateTime();
  return {
    id: createId("task"),
    title: draft.title.trim(),
    dueDate: draft.dueDate,
    priority: draft.priority,
    done: false,
    note: draft.note.trim(),
    reminderAt: draft.reminderAt,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

/**
 * 기존 `Task`에 `TaskDraft`의 변경 내용을 적용한 새 객체를 반환한다. `updatedAt`을 갱신한다.
 * @param task 수정 대상 기존 태스크
 * @param draft 사용자가 입력한 수정 내용
 */
export function updateTaskFromDraft(task: Task, draft: TaskDraft): Task {
  return {
    ...task,
    title: draft.title.trim(),
    dueDate: draft.dueDate,
    priority: draft.priority,
    note: draft.note.trim(),
    reminderAt: draft.reminderAt,
    updatedAt: nowLocalDateTime()
  };
}

/**
 * `Task`를 `TaskDraft`로 변환한다. 편집 모달을 열 때 초기값으로 사용된다.
 * @param task 변환할 태스크
 */
export function taskToDraft(task: Task): TaskDraft {
  return {
    title: task.title,
    dueDate: task.dueDate,
    priority: task.priority,
    note: task.note ?? "",
    reminderAt: task.reminderAt
  };
}

export type TaskFilter = "selected" | "open" | "done" | "all";

export function filterTasks(tasks: Task[], filter: TaskFilter, selectedDate: IsoDate): Task[] {
  if (filter === "selected") return getTasksForDate(tasks, selectedDate);
  if (filter === "open") return tasks.filter((task) => !task.done);
  if (filter === "done") return tasks.filter((task) => task.done);
  return tasks;
}

export interface TaskViewModel {
  id: string;
  title: string;
  done: boolean;
  note: string;
  dueDateFormatted: string;
  priorityLabel: string;
  rowClassName: string;
  reminderFormatted: string | null;
  toggleLabel: string;
  draft: TaskDraft;
}

export function toTaskViewModel(task: Task): TaskViewModel {
  return {
    id: task.id,
    title: task.title,
    done: task.done,
    note: task.note,
    dueDateFormatted: formatDate(task.dueDate),
    priorityLabel: PRIORITY_LABEL[task.priority],
    rowClassName: `task-row ${TASK_PRIORITY_CLASS[task.priority]}${task.done ? " done" : ""}`,
    reminderFormatted: task.reminderAt ? task.reminderAt.replace("T", " ") : null,
    toggleLabel: task.done ? "열기" : "완료",
    draft: taskToDraft(task)
  };
}

/** 새 태스크 작성 시 사용할 기본 `TaskDraft`를 반환한다. */
export function makeDefaultTaskDraft(date: IsoDate): TaskDraft {
  return {
    title: "",
    dueDate: date,
    priority: "medium",
    note: "",
    reminderAt: null
  };
}
