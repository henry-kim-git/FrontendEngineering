import { describe, expect, it } from "vitest";
import { clampMinutes, eventStyle, minutesToTime, rangeStyle, roundToStep, timeToMinutes } from "@/src/lib/weekGrid";
import type { ScheduleEvent } from "@/src/planner";

describe("timeToMinutes / minutesToTime", () => {
  it("HH:mm 문자열을 분으로 변환한다", () => {
    expect(timeToMinutes("09:30")).toBe(570);
  });

  it("분을 HH:mm 문자열로 되돌린다", () => {
    expect(minutesToTime(570)).toBe("09:30");
  });

  it("범위를 벗어난 값은 0~23:59로 clamp한다", () => {
    expect(minutesToTime(-10)).toBe("00:00");
    expect(minutesToTime(100000)).toBe("23:59");
  });
});

describe("clampMinutes", () => {
  it("타임라인 범위(06:00~24:00) 밖의 값을 경계로 자른다", () => {
    expect(clampMinutes(0)).toBe(6 * 60);
    expect(clampMinutes(100000)).toBe(24 * 60);
  });
});

describe("roundToStep", () => {
  it("지정한 step 단위로 반올림한다", () => {
    expect(roundToStep(101, 15)).toBe(105);
    expect(roundToStep(97, 15)).toBe(90);
  });
});

describe("rangeStyle", () => {
  it("start/end가 뒤바뀌어도 정렬해서 top/height를 계산한다", () => {
    const forward = rangeStyle(6 * 60, 7 * 60);
    const backward = rangeStyle(7 * 60, 6 * 60);
    expect(backward).toEqual(forward);
  });

  it("최소 높이 28px을 보장한다", () => {
    const style = rangeStyle(6 * 60, 6 * 60 + 1);
    expect(style.height).toBe("28px");
  });
});

describe("eventStyle", () => {
  it("최소 이벤트 길이(30분) 미만이면 30분으로 확장한다", () => {
    const event = { startTime: "09:00", endTime: "09:10" } as ScheduleEvent;
    const style = eventStyle(event);
    // 09:00~09:30 => height = (30/60)*56 - 4 = 24 -> clamped to min 28
    expect(style.height).toBe("28px");
  });
});
