import { createInitialState, parseIsoDate } from "@/src/planner";
import type { PlannerState } from "@/src/planner";

const STORAGE_KEY = "plain-planner:v1";

export function loadPlannerState(): PlannerState {
  const fallback = createInitialState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PlannerState>;
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : fallback.tasks,
      events: Array.isArray(parsed.events) ? parsed.events : fallback.events,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : fallback.notifications,
      selectedDate: (typeof parsed.selectedDate === "string" ? parseIsoDate(parsed.selectedDate) : null) ?? fallback.selectedDate,
      visibleMonth: (typeof parsed.visibleMonth === "string" ? parseIsoDate(parsed.visibleMonth) : null) ?? fallback.visibleMonth
    };
  } catch {
    return fallback;
  }
}

export function savePlannerState(state: PlannerState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
