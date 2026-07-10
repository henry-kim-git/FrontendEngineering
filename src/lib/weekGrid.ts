import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import type { ScheduleEvent } from "@/src/planner";

export const START_HOUR = 6;
export const END_HOUR = 23;
export const HOUR_HEIGHT = 56;
export const MIN_EVENT_MINUTES = 30;
export const MIN_TIMELINE_MINUTES = START_HOUR * 60;
export const MAX_TIMELINE_MINUTES = (END_HOUR + 1) * 60;
export const MAX_TIME_INPUT_MINUTES = 23 * 60 + 59;
export const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => START_HOUR + index);

export function timeToMinutes(value: string): number {
  const [hour = "0", minute = "0"] = value.split(":");
  return Number(hour) * 60 + Number(minute);
}

export function clampMinutes(value: number): number {
  return Math.min(MAX_TIMELINE_MINUTES, Math.max(MIN_TIMELINE_MINUTES, value));
}

export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function minutesToTime(value: number): string {
  const safeValue = Math.min(MAX_TIME_INPUT_MINUTES, Math.max(0, value));
  const hour = Math.floor(safeValue / 60);
  const minute = safeValue % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function rangeStyle(startValue: number, endValue: number): CSSProperties {
  const start = Math.min(startValue, endValue);
  const end = Math.max(startValue, endValue);
  return {
    top: `${((start - START_HOUR * 60) / 60) * HOUR_HEIGHT}px`,
    height: `${Math.max(28, ((end - start) / 60) * HOUR_HEIGHT - 4)}px`
  };
}

export function eventStyle(event: ScheduleEvent): CSSProperties {
  const start = clampMinutes(timeToMinutes(event.startTime));
  const end = Math.max(start + MIN_EVENT_MINUTES, clampMinutes(timeToMinutes(event.endTime)));
  return rangeStyle(start, end);
}

export function minutesFromPointer(event: ReactPointerEvent<HTMLDivElement>): number {
  const rect = event.currentTarget.getBoundingClientRect();
  const y = Math.max(0, event.clientY - rect.top);
  const rawMinutes = START_HOUR * 60 + (y / HOUR_HEIGHT) * 60;
  return roundToStep(clampMinutes(rawMinutes), 15);
}
