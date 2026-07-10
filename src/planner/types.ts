declare const __isoDate: unique symbol;
export type IsoDate = string & { readonly [__isoDate]: true };

declare const __localDateTime: unique symbol;
export type LocalDateTime = string & { readonly [__localDateTime]: true };
export type Priority = "low" | "medium" | "high";
export type EventCategory = "work" | "personal" | "study" | "health";
export type NotificationStatus = "scheduled" | "ready" | "read";

export interface Task {
  id: string;
  title: string;
  dueDate: IsoDate;
  priority: Priority;
  done: boolean;
  note: string;
  reminderAt: LocalDateTime | null;
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: IsoDate;
  startTime: string;
  endTime: string;
  category: EventCategory;
  note: string;
  reminderAt: LocalDateTime | null;
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

export interface PlannerNotification {
  id: string;
  sourceId: string;
  sourceType: "task" | "event";
  title: string;
  body: string;
  notifyAt: LocalDateTime;
  status: NotificationStatus;
  createdAt: LocalDateTime;
}

export interface PlannerState {
  tasks: Task[];
  events: ScheduleEvent[];
  notifications: PlannerNotification[];
  selectedDate: IsoDate;
  visibleMonth: IsoDate;
}

export interface TaskDraft {
  title: string;
  dueDate: IsoDate;
  priority: Priority;
  note: string;
  reminderAt: LocalDateTime | null;
}

export interface EventDraft {
  title: string;
  date: IsoDate;
  startTime: string;
  endTime: string;
  category: EventCategory;
  note: string;
  reminderAt: LocalDateTime | null;
}

export interface CalendarDay {
  date: IsoDate;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface WeekDay {
  date: IsoDate;
  dayOfMonth: number;
  weekday: string;
  isToday: boolean;
}
