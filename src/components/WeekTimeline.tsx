"use client";

import { useState } from "react";
import { EventEditorModal } from "@/src/components/EventEditorModal";
import type { EventEditorState } from "@/src/components/EventEditorModal";
import { createWeekDays, EVENT_CATEGORY_CLASS, eventToDraft, getEventsForDate, getTasksForDate, TASK_PRIORITY_CLASS, todayIso } from "@/src/planner";
import type { EventDraft, IsoDate, ScheduleEvent, Task } from "@/src/planner";
import { eventStyle, hours, rangeStyle } from "@/src/lib/weekGrid";
import { useWeekDragSelection } from "@/src/hooks/useWeekDragSelection";

interface WeekTimelineProps {
  tasks: Task[];
  events: ScheduleEvent[];
  selectedDate: IsoDate;
  onSelectDate(date: IsoDate): void;
  onAddEvent(draft: EventDraft): void;
  onUpdateEvent(id: string, draft: EventDraft): void;
}

export function WeekTimeline({ tasks, events, selectedDate, onSelectDate, onAddEvent, onUpdateEvent }: WeekTimelineProps) {
  const days = createWeekDays(selectedDate, todayIso());
  const [editor, setEditor] = useState<EventEditorState | null>(null);
  const { drag, startDrag, moveDrag, finishDrag, cancelDrag } = useWeekDragSelection(onSelectDate, (result) => {
    setEditor({
      mode: "create",
      draft: {
        title: "",
        date: result.date,
        startTime: result.startTime,
        endTime: result.endTime,
        category: "work",
        note: "",
        reminderAt: null
      }
    });
  });

  return (
    <section className="week-board">
      <div className="week-header">
        <div className="week-corner" />
        {days.map((day) => (
          <button
            className={`week-day-header ${selectedDate === day.date ? "is-selected" : ""}`}
            type="button"
            key={day.date}
            onClick={() => onSelectDate(day.date)}
          >
            <span>{day.weekday}</span>
            <strong className={day.isToday ? "is-today" : ""}>{day.dayOfMonth}</strong>
          </button>
        ))}
      </div>

      <div className="week-all-day">
        <div className="week-all-day-label">할 일</div>
        {days.map((day) => {
          const dayTasks = getTasksForDate(tasks, day.date).filter((task) => !task.done);
          return (
            <button
              className={`week-all-day-cell ${selectedDate === day.date ? "is-selected" : ""}`}
              type="button"
              key={day.date}
              onClick={() => onSelectDate(day.date)}
            >
              {dayTasks.slice(0, 2).map((task) => (
                <span className={`week-task-chip ${TASK_PRIORITY_CLASS[task.priority]}`} key={task.id}>
                  {task.title}
                </span>
              ))}
              {dayTasks.length > 2 ? <span className="week-more">+{dayTasks.length - 2}</span> : null}
            </button>
          );
        })}
      </div>

      <div className="week-body">
        <div className="time-gutter">
          {hours.map((hour) => (
            <div className="time-label" key={hour}>
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>
        <div className="week-columns">
          {days.map((day) => {
            const dayEvents = getEventsForDate(events, day.date);
            return (
              <div
                className={`week-column ${selectedDate === day.date ? "is-selected" : ""}`}
                key={day.date}
                onPointerDown={(event) => startDrag(event, day.date)}
                onPointerMove={(event) => moveDrag(event, day.date)}
                onPointerUp={(event) => finishDrag(event, day.date)}
                onPointerCancel={cancelDrag}
              >
                <span className="week-hour-lines">
                  {hours.map((hour) => (
                    <span className="week-hour-line" key={hour} />
                  ))}
                </span>
                {drag?.date === day.date ? <span className="week-selection" style={rangeStyle(drag.start, drag.end)} /> : null}
                {dayEvents.map((event) => (
                  <button
                    className={`week-event ${EVENT_CATEGORY_CLASS[event.category]}`}
                    style={eventStyle(event)}
                    type="button"
                    key={event.id}
                    onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
                    onClick={(clickEvent) => {
                      clickEvent.stopPropagation();
                      onSelectDate(event.date);
                      setEditor({ mode: "edit", eventId: event.id, draft: eventToDraft(event) });
                    }}
                  >
                    <strong>{event.title}</strong>
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {editor ? (
        <EventEditorModal
          key={editor.mode === "edit" ? editor.eventId : `${editor.draft.date}-${editor.draft.startTime}-${editor.draft.endTime}`}
          title={editor.mode === "edit" ? "일정 수정" : "일정 추가"}
          initialDraft={editor.draft}
          isEditing={editor.mode === "edit"}
          onClose={() => setEditor(null)}
          onSubmit={(draft) => {
            if (editor.mode === "edit") {
              onUpdateEvent(editor.eventId, draft);
            } else {
              onAddEvent(draft);
            }
            setEditor(null);
          }}
        />
      ) : null}
    </section>
  );
}
