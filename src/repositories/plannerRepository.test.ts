import { beforeEach, describe, expect, it } from "vitest";
import { loadPlannerState, savePlannerState } from "@/src/repositories/plannerRepository";
import { createInitialState } from "@/src/planner";

const STORAGE_KEY = "plain-planner:v1";

beforeEach(() => {
  window.localStorage.clear();
});

describe("loadPlannerState", () => {
  it("저장된 값이 없으면 시드 데이터로 폴백한다", () => {
    const state = loadPlannerState();
    expect(state.tasks.length).toBeGreaterThan(0);
  });

  it("손상된 JSON이면 시드 데이터로 폴백한다", () => {
    window.localStorage.setItem(STORAGE_KEY, "{not valid json");
    const state = loadPlannerState();
    expect(state.tasks.length).toBeGreaterThan(0);
  });

  it("일부 필드가 배열이 아니면 해당 필드만 시드 값으로 대체한다", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: "broken", events: [], notifications: [] }));
    const state = loadPlannerState();
    expect(Array.isArray(state.tasks)).toBe(true);
    expect(state.events).toEqual([]);
  });
});

describe("save -> load 라운드트립", () => {
  it("저장한 상태를 그대로 다시 읽어온다", () => {
    const original = createInitialState();
    savePlannerState(original);
    const loaded = loadPlannerState();
    expect(loaded).toEqual(original);
  });
});
