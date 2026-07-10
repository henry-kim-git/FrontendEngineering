"use client";

import { FormEvent, useReducer } from "react";
import { Modal } from "@/src/components/Modal";
import { nowLocalDateTime } from "@/src/planner";
import type { EventCategory, EventDraft, IsoDate, LocalDateTime } from "@/src/planner";
import { eventModalReducer } from "@/src/hooks/eventModalReducer";

export type EventEditorState =
  | { mode: "create"; draft: EventDraft }
  | { mode: "edit"; eventId: string; draft: EventDraft };

interface EventEditorModalProps {
  title: string;
  initialDraft: EventDraft;
  isEditing: boolean;
  onClose(): void;
  onSubmit(draft: EventDraft): void;
}

export function EventEditorModal({ title, initialDraft, isEditing, onClose, onSubmit }: EventEditorModalProps) {
  const [draft, dispatch] = useReducer(eventModalReducer, initialDraft);
  const { title: name, date, startTime, endTime, category, note, reminderAt } = draft;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    onSubmit({ ...draft, reminderAt: (reminderAt || null) as LocalDateTime | null });
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="event-title">제목</label>
          <input
            id="event-title"
            value={name}
            onChange={(event) => dispatch({ type: "patch", patch: { title: event.target.value } })}
            autoFocus
          />
        </div>
        <div className="modal-form-grid">
          <div className="field">
            <label htmlFor="event-date">날짜</label>
            <input
              id="event-date"
              type="date"
              value={date}
              onChange={(event) => dispatch({ type: "patch", patch: { date: event.target.value as IsoDate } })}
            />
          </div>
          <div className="field">
            <label htmlFor="event-category">분류</label>
            <select
              id="event-category"
              value={category}
              onChange={(event) => dispatch({ type: "patch", patch: { category: event.target.value as EventCategory } })}
            >
              <option value="work">업무</option>
              <option value="personal">개인</option>
              <option value="study">학습</option>
              <option value="health">건강</option>
            </select>
          </div>
        </div>
        <div className="modal-form-grid">
          <div className="field">
            <label htmlFor="event-start">시작</label>
            <input
              id="event-start"
              type="time"
              value={startTime}
              onChange={(event) => dispatch({ type: "patch", patch: { startTime: event.target.value } })}
            />
          </div>
          <div className="field">
            <label htmlFor="event-end">종료</label>
            <input
              id="event-end"
              type="time"
              value={endTime}
              onChange={(event) => dispatch({ type: "patch", patch: { endTime: event.target.value } })}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="event-reminder">알림 시간</label>
          <input
            id="event-reminder"
            type="datetime-local"
            min={isEditing && reminderAt ? reminderAt : nowLocalDateTime()}
            value={reminderAt ?? ""}
            onChange={(event) => dispatch({ type: "patch", patch: { reminderAt: (event.target.value || null) as LocalDateTime | null } })}
          />
        </div>
        <div className="field">
          <label htmlFor="event-note">메모</label>
          <textarea
            id="event-note"
            value={note}
            onChange={(event) => dispatch({ type: "patch", patch: { note: event.target.value } })}
          />
        </div>
        <div className="modal-footer">
          <button className="secondary-button" type="button" onClick={onClose}>
            취소
          </button>
          <button className="primary-button" type="submit">
            저장
          </button>
        </div>
      </form>
    </Modal>
  );
}
