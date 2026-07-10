import { describe, expect, it } from "vitest";
import { addDays, addMinutes, addMonths, compareDateTime, formatDate, formatDateTime, formatMonth, parseIsoDate, startOfWeek } from "@/src/planner/datetime";
import type { IsoDate, LocalDateTime } from "@/src/planner/types";

const iso = (value: string) => value as IsoDate;
const dt = (value: string) => value as LocalDateTime;

describe("parseIsoDate", () => {
  it("유효한 YYYY-MM-DD 문자열을 IsoDate로 반환한다", () => {
    expect(parseIsoDate("2026-07-10")).toBe("2026-07-10");
  });

  it("형식이 다른 문자열은 null을 반환한다", () => {
    expect(parseIsoDate("2026/07/10")).toBeNull();
    expect(parseIsoDate("2026-7-10")).toBeNull();
  });

  it("존재하지 않는 날짜(2월 30일)는 null을 반환한다", () => {
    expect(parseIsoDate("2026-02-30")).toBeNull();
  });
});

describe("addDays", () => {
  it("월 경계를 넘어 더한다", () => {
    expect(addDays(iso("2026-01-31"), 1)).toBe("2026-02-01");
  });

  it("음수를 더하면 이전 날짜가 된다", () => {
    expect(addDays(iso("2026-03-01"), -1)).toBe("2026-02-28");
  });
});

describe("addMonths", () => {
  it("연도 경계를 넘어 더하고 항상 1일로 정규화한다", () => {
    expect(addMonths(iso("2026-12-15"), 1)).toBe("2027-01-01");
  });
});

describe("startOfWeek", () => {
  it("해당 주의 일요일을 반환한다", () => {
    // 2026-07-10은 금요일
    expect(startOfWeek(iso("2026-07-10"))).toBe("2026-07-05");
  });

  it("일요일 자신을 넣으면 그대로 반환한다", () => {
    expect(startOfWeek(iso("2026-07-05"))).toBe("2026-07-05");
  });
});

describe("addMinutes", () => {
  it("시간 경계를 넘어 더한다", () => {
    expect(addMinutes(dt("2026-07-10T23:50"), 20)).toBe("2026-07-11T00:10");
  });
});

describe("compareDateTime", () => {
  it("이전 시각과 비교하면 음수를 반환한다", () => {
    expect(compareDateTime(dt("2026-07-10T09:00"), dt("2026-07-10T10:00"))).toBeLessThan(0);
  });

  it("같은 시각을 비교하면 0을 반환한다", () => {
    expect(compareDateTime(dt("2026-07-10T09:00"), dt("2026-07-10T09:00"))).toBe(0);
  });
});

describe("formatMonth / formatDate / formatDateTime", () => {
  it("한국어 월 표기로 변환한다", () => {
    expect(formatMonth(iso("2026-07-10"))).toBe("2026년 7월");
  });

  it("YYYY.MM.DD 형식으로 변환한다", () => {
    expect(formatDate(iso("2026-07-10"))).toBe("2026.07.10");
  });

  it("날짜와 시각을 공백으로 이어붙인다", () => {
    expect(formatDateTime(dt("2026-07-10T09:05"))).toBe("2026.07.10 09:05");
  });
});
