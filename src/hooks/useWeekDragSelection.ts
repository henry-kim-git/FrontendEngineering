"use client";

import { useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { IsoDate } from "@/src/planner";
import { MAX_TIMELINE_MINUTES, MIN_EVENT_MINUTES, MIN_TIMELINE_MINUTES, minutesFromPointer, minutesToTime } from "@/src/lib/weekGrid";

export interface DragState {
  date: IsoDate;
  start: number;
  end: number;
  moved: boolean;
}

export interface DragResult {
  date: IsoDate;
  startTime: string;
  endTime: string;
}

export function useWeekDragSelection(onSelectDate: (date: IsoDate) => void, onDragComplete: (result: DragResult) => void) {
  const [drag, setDrag] = useState<DragState | null>(null);

  function startDrag(event: ReactPointerEvent<HTMLDivElement>, date: IsoDate) {
    if (event.button !== 0) {
      return;
    }

    const minutes = minutesFromPointer(event);
    onSelectDate(date);
    setDrag({ date, start: minutes, end: minutes, moved: false });
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function moveDrag(event: ReactPointerEvent<HTMLDivElement>, date: IsoDate) {
    const end = minutesFromPointer(event);

    setDrag((current) => {
      if (!current || current.date !== date) {
        return current;
      }

      return {
        ...current,
        end,
        moved: current.moved || Math.abs(end - current.start) >= 15
      };
    });
  }

  function finishDrag(event: ReactPointerEvent<HTMLDivElement>, date: IsoDate) {
    if (!drag || drag.date !== date) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    let start = Math.min(drag.start, drag.end);
    let end = Math.max(drag.start, drag.end);

    if (end - start < MIN_EVENT_MINUTES) {
      if (start + MIN_EVENT_MINUTES <= MAX_TIMELINE_MINUTES) {
        end = start + MIN_EVENT_MINUTES;
      } else {
        end = MAX_TIMELINE_MINUTES;
        start = Math.max(MIN_TIMELINE_MINUTES, end - MIN_EVENT_MINUTES);
      }
    }

    const moved = drag.moved;
    setDrag(null);
    if (!moved) {
      return;
    }

    onDragComplete({ date, startTime: minutesToTime(start), endTime: minutesToTime(end) });
  }

  function cancelDrag() {
    setDrag(null);
  }

  return { drag, startDrag, moveDrag, finishDrag, cancelDrag };
}
