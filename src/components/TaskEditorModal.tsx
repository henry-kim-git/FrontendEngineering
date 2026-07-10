"use client";

import { FormEvent, useReducer } from "react";
import { Modal } from "@/src/components/Modal";
import { nowLocalDateTime } from "@/src/planner";
import type { IsoDate, LocalDateTime, Priority, TaskDraft } from "@/src/planner";
import { taskModalReducer } from "@/src/hooks/taskModalReducer";

export type TaskEditorState =
  | { mode: "create"; draft: TaskDraft }
  | { mode: "edit"; taskId: string; draft: TaskDraft };

interface TaskEditorModalProps {
  title: string;
  initialDraft: TaskDraft;
  isEditing: boolean;
  onClose(): void;
  onSubmit(draft: TaskDraft): void;
}

export function TaskEditorModal({ title, initialDraft, isEditing, onClose, onSubmit }: TaskEditorModalProps) {
  const [draft, dispatch] = useReducer(taskModalReducer, initialDraft);
  const { title: taskTitle, dueDate, priority, note, reminderAt } = draft;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!taskTitle.trim()) {
      return;
    }
    onSubmit({ ...draft, reminderAt: (reminderAt || null) as LocalDateTime | null });
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        <div className="field">
          <label htmlFor="task-title">제목</label>
          <input
            id="task-title"
            value={taskTitle}
            onChange={(e) => dispatch({ type: "patch", patch: { title: e.target.value } })}
            autoFocus
          />
        </div>
        <div className="modal-form-grid">
          <div className="field">
            <label htmlFor="task-date">마감일</label>
            <input
              id="task-date"
              type="date"
              value={dueDate}
              onChange={(e) => dispatch({ type: "patch", patch: { dueDate: e.target.value as IsoDate } })}
            />
          </div>
          <div className="field">
            <label htmlFor="task-priority">우선순위</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => dispatch({ type: "patch", patch: { priority: e.target.value as Priority } })}
            >
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="task-reminder">알림 시간</label>
          <input
            id="task-reminder"
            type="datetime-local"
            min={isEditing && reminderAt ? reminderAt : nowLocalDateTime()}
            value={reminderAt ?? ""}
            onChange={(e) => dispatch({ type: "patch", patch: { reminderAt: (e.target.value || null) as LocalDateTime | null } })}
          />
        </div>
        <div className="field">
          <label htmlFor="task-note">메모</label>
          <textarea
            id="task-note"
            value={note}
            onChange={(e) => dispatch({ type: "patch", patch: { note: e.target.value } })}
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
