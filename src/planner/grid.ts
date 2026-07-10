import { addDays, isoDateToDate, startOfWeek, toIsoDate, weekdays } from "@/src/planner/datetime";
import { EVENT_CATEGORY_CLASS, getEventsForDate } from "@/src/planner/events";
import { TASK_PRIORITY_CLASS, getTasksForDate } from "@/src/planner/tasks";
import type { CalendarDay, IsoDate, ScheduleEvent, Task, WeekDay } from "@/src/planner/types";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 월 달력 렌더링에 필요한 42개(6행 × 7열) `CalendarDay` 배열을 반환한다.
 * 앞뒤 달의 날짜로 빈 셀을 채운다.
 * @param visibleMonth 표시할 달의 임의 날짜 (IsoDate)
 * @param today 오늘 날짜 (isToday 판별에 사용)
 */
export function createMonthGrid(visibleMonth: IsoDate, today: IsoDate): CalendarDay[] {
  const monthStart = isoDateToDate(visibleMonth);
  const firstDay = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
  const gridStart = new Date(firstDay.getTime() - firstDay.getDay() * DAY_MS);
  const currentMonth = firstDay.getMonth();

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getTime() + index * DAY_MS);
    const iso = toIsoDate(date);
    return {
      date: iso,
      dayOfMonth: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth,
      isToday: iso === today
    };
  });
}

/**
 * 주 타임라인 렌더링에 필요한 7개 `WeekDay` 배열을 반환한다.
 * `selectedDate`가 속한 주의 일요일부터 토요일까지를 포함한다.
 * @param selectedDate 기준 날짜 (IsoDate)
 * @param today 오늘 날짜 (isToday 판별에 사용)
 */
export function createWeekDays(selectedDate: IsoDate, today: IsoDate): WeekDay[] {
  const start = startOfWeek(selectedDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);
    const parsed = isoDateToDate(date);
    return {
      date,
      dayOfMonth: parsed.getDate(),
      weekday: weekdays[index],
      isToday: date === today
    };
  });
}

export interface CalendarDayViewModel {
  date: IsoDate;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  className: string;
  visibleEvents: Array<{ id: string; startTime: string; title: string; categoryClass: string }>;
  visibleTasks: Array<{ id: string; title: string; priorityClass: string }>;
  hiddenCount: number;
}

export function createCalendarDayViewModels(
  visibleMonth: IsoDate,
  today: IsoDate,
  selectedDate: IsoDate,
  tasks: Task[],
  events: ScheduleEvent[]
): CalendarDayViewModel[] {
  return createMonthGrid(visibleMonth, today).map((day) => {
    const dayTasks = getTasksForDate(tasks, day.date).filter((task) => !task.done);
    const dayEvents = getEventsForDate(events, day.date);
    const visibleEvents = dayEvents.slice(0, 3);
    const visibleTasks = dayTasks.slice(0, Math.max(0, 3 - visibleEvents.length));
    const hiddenCount = dayEvents.length + dayTasks.length - visibleEvents.length - visibleTasks.length;
    const className = ["day-cell", day.isCurrentMonth ? "" : "is-muted", selectedDate === day.date ? "is-selected" : ""]
      .filter(Boolean)
      .join(" ");
    return {
      ...day,
      isSelected: selectedDate === day.date,
      className,
      visibleEvents: visibleEvents.map((event) => ({
        id: event.id,
        startTime: event.startTime,
        title: event.title,
        categoryClass: EVENT_CATEGORY_CLASS[event.category]
      })),
      visibleTasks: visibleTasks.map((task) => ({
        id: task.id,
        title: task.title,
        priorityClass: TASK_PRIORITY_CLASS[task.priority]
      })),
      hiddenCount
    };
  });
}
