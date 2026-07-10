import type { IsoDate, LocalDateTime } from "@/src/planner/types";

export const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 고유 ID를 생성한다.
 * @param prefix ID 앞에 붙이는 접두사 (예: "task", "event")
 * @returns `{prefix}_{uuid}` 형태의 문자열
 */
export function createId(prefix: string): string {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
  return `${prefix}_${random}`;
}

/**
 * `Date` 객체를 `YYYY-MM-DD` 형식의 IsoDate 문자열로 변환한다.
 * @param date 변환할 Date 객체
 * @returns `YYYY-MM-DD` 형식의 날짜 문자열
 */
export function toIsoDate(date: Date): IsoDate {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}` as IsoDate;
}

/**
 * `Date` 객체를 `YYYY-MM-DDTHH:mm` 형식의 LocalDateTime 문자열로 변환한다.
 * @param date 변환할 Date 객체
 * @returns `YYYY-MM-DDTHH:mm` 형식의 날짜+시각 문자열
 */
export function toLocalDateTime(date: Date): LocalDateTime {
  const isoDate = toIsoDate(date);
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${isoDate}T${hour}:${minute}` as LocalDateTime;
}

/** 오늘 날짜를 IsoDate 형식으로 반환한다. */
export function todayIso(): IsoDate {
  return toIsoDate(new Date());
}

/** 현재 날짜·시각을 LocalDateTime 형식으로 반환한다. */
export function nowLocalDateTime(): LocalDateTime {
  return toLocalDateTime(new Date());
}

/**
 * IsoDate 문자열을 `Date` 객체로 변환한다. 시간대 오프셋 없이 로컬 자정으로 해석한다.
 * `grid.ts`에서도 사용하므로 모듈 내부 전용이 아니라 일반 export로 두되, 배럴(index.ts)에서는
 * 재수출하지 않아 외부 공개 API에는 노출되지 않는다.
 * @param value 유효한 `YYYY-MM-DD` 형식의 IsoDate
 * @returns 해당 날짜의 로컬 자정 Date 객체
 */
export function isoDateToDate(value: IsoDate): Date {
  const [year = "0", month = "1", day = "1"] = value.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * 임의의 문자열을 검증하여 유효한 `IsoDate`로 반환한다.
 * `YYYY-MM-DD` 형식이 아니거나 존재하지 않는 날짜(예: 2월 30일)이면 `null`을 반환한다.
 * @param value 검증할 문자열
 * @returns 유효한 `IsoDate` 또는 `null`
 */
export function parseIsoDate(value: string): IsoDate | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = isoDateToDate(value as IsoDate);
  return toIsoDate(date) === value ? (value as IsoDate) : null;
}

/**
 * IsoDate에 지정한 일수를 더한 날짜를 반환한다.
 * @param value 기준 날짜 (IsoDate)
 * @param amount 더할 일수 (음수면 이전 날짜)
 */
export function addDays(value: IsoDate, amount: number): IsoDate {
  const date = isoDateToDate(value);
  date.setDate(date.getDate() + amount);
  return toIsoDate(date);
}

/**
 * LocalDateTime에 지정한 분을 더한 날짜·시각을 반환한다.
 * @param value 기준 날짜·시각 (LocalDateTime)
 * @param amount 더할 분 수 (음수면 이전 시각)
 */
export function addMinutes(value: LocalDateTime, amount: number): LocalDateTime {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() + amount);
  return toLocalDateTime(date);
}

/**
 * IsoDate에 지정한 개월 수를 더한 달의 1일을 반환한다.
 * @param value 기준 날짜 (IsoDate)
 * @param amount 더할 개월 수 (음수면 이전 달)
 */
export function addMonths(value: IsoDate, amount: number): IsoDate {
  const date = isoDateToDate(value);
  return toIsoDate(new Date(date.getFullYear(), date.getMonth() + amount, 1));
}

/**
 * 주어진 날짜가 속한 주의 일요일(첫째 날)을 반환한다.
 * @param value 기준 날짜 (IsoDate)
 */
export function startOfWeek(value: IsoDate): IsoDate {
  const date = isoDateToDate(value);
  date.setDate(date.getDate() - date.getDay());
  return toIsoDate(date);
}

/**
 * IsoDate를 `YYYY년 M월` 형식의 문자열로 반환한다.
 * @param value 기준 날짜 (IsoDate)
 */
export function formatMonth(value: IsoDate): string {
  const date = isoDateToDate(value);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

/**
 * IsoDate를 `YYYY년 M월 N번째 주` 형식의 문자열로 반환한다.
 * @param value 기준 날짜 (IsoDate)
 */
export function formatWeekTitle(value: IsoDate): string {
  const date = isoDateToDate(value);
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const weekNumber = Math.floor((date.getDate() + firstDayOfMonth.getDay() - 1) / 7) + 1;
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${weekNumber}번째 주`;
}

/**
 * IsoDate를 `YYYY.MM.DD` 형식의 문자열로 반환한다.
 * @param value 기준 날짜 (IsoDate)
 */
export function formatDate(value: IsoDate): string {
  const date = isoDateToDate(value);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * LocalDateTime을 `YYYY.MM.DD HH:mm` 형식의 문자열로 반환한다.
 * @param value 기준 날짜·시각 (LocalDateTime)
 */
export function formatDateTime(value: LocalDateTime): string {
  const [date, time = ""] = value.split("T");
  return `${formatDate(date as IsoDate)} ${time}`;
}

/**
 * 두 LocalDateTime을 비교한다. `Array.sort` 콜백에 직접 전달할 수 있다.
 * @returns `left < right`이면 음수, 같으면 0, `left > right`이면 양수
 */
export function compareDateTime(left: LocalDateTime, right: LocalDateTime): number {
  return new Date(left).getTime() - new Date(right).getTime();
}
