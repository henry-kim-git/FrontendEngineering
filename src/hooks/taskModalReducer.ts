import type { TaskDraft } from "@/src/planner";

export type TaskModalState = TaskDraft;

export type TaskModalAction = { type: "patch"; patch: Partial<TaskDraft> };

export function taskModalReducer(state: TaskModalState, action: TaskModalAction): TaskModalState {
  switch (action.type) {
    case "patch":
      return { ...state, ...action.patch };
    default:
      return state;
  }
}
