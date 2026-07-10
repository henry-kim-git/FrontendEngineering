import type { EventDraft } from "@/src/planner";

export type EventModalState = EventDraft;

export type EventModalAction = { type: "patch"; patch: Partial<EventDraft> };

export function eventModalReducer(state: EventModalState, action: EventModalAction): EventModalState {
  switch (action.type) {
    case "patch":
      return { ...state, ...action.patch };
    default:
      return state;
  }
}
