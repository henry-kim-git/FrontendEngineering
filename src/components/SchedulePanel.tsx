"use client";

import { useState } from "react";
import { EventEditorModal } from "@/src/components/EventEditorModal";
import type { EventEditorState } from "@/src/components/EventEditorModal";
import { CATEGORY_LABEL, eventToDraft, formatDate, getEventsForDate, makeDefaultEventDraft } from "@/src/planner";
import type { EventDraft, IsoDate, ScheduleEvent } from "@/src/planner";
import { EntryList, EntryRow } from "@/src/components/EntryList";

interface SchedulePanelProps {
  selectedDate: IsoDate;
  events: ScheduleEvent[];
  onAddEvent(draft: EventDraft): void;
  onUpdateEvent(id: string, draft: EventDraft): void;
  onDeleteEvent(id: string): void;
}

export function SchedulePanel({ selectedDate, events, onAddEvent, onUpdateEvent, onDeleteEvent }: SchedulePanelProps) {
  const [modalState, setModalState] = useState<EventEditorState | null>(null);
  const selectedEvents = getEventsForDate(events, selectedDate);

  function openCreateModal() {
    setModalState({ mode: "create", draft: makeDefaultEventDraft(selectedDate) });
  }

  function openEditModal(event: ScheduleEvent) {
    setModalState({
      mode: "edit",
      eventId: event.id,
      draft: eventToDraft(event)
    });
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>일정</h2>
        <div className="panel-actions">
          <span className="tag">{formatDate(selectedDate)}</span>
          <button className="primary-button" type="button" onClick={openCreateModal}>
            추가
          </button>
        </div>
      </div>
      <div className="panel-body">
        <EntryList
          items={selectedEvents}
          emptyLabel="항목 없음"
          renderItem={(item) => (
            <EntryRow
              key={item.id}
              className={`schedule-row category-${item.category}`}
              title={item.title}
              tags={[
                `${item.startTime} - ${item.endTime}`,
                CATEGORY_LABEL[item.category],
                ...(item.reminderAt ? [item.reminderAt.replace("T", " ")] : [])
              ]}
              note={item.note}
              actions={
                <>
                  <button className="secondary-button" type="button" onClick={() => openEditModal(item)}>
                    수정
                  </button>
                  <button className="danger-button" type="button" onClick={() => onDeleteEvent(item.id)}>
                    삭제
                  </button>
                </>
              }
            />
          )}
        />
      </div>
      {modalState ? (
        <EventEditorModal
          title={modalState.mode === "edit" ? "일정 수정" : "일정 추가"}
          initialDraft={modalState.draft}
          isEditing={modalState.mode === "edit"}
          onClose={() => setModalState(null)}
          onSubmit={(draft) => {
            if (modalState.mode === "edit") {
              onUpdateEvent(modalState.eventId, draft);
            } else {
              onAddEvent(draft);
            }
            setModalState(null);
          }}
        />
      ) : null}
    </section>
  );
}

