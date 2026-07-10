"use client";

import { useMemo, useState } from "react";
import { filterTasks, makeDefaultTaskDraft, toTaskViewModel } from "@/src/planner";
import type { IsoDate, Task, TaskDraft, TaskFilter, TaskViewModel } from "@/src/planner";
import { TaskEditorModal } from "@/src/components/TaskEditorModal";
import type { TaskEditorState } from "@/src/components/TaskEditorModal";
import { EntryList, EntryRow } from "@/src/components/EntryList";
import { SegmentedControl } from "@/src/components/SegmentedControl";

interface TaskPanelProps {
  selectedDate: IsoDate;
  tasks: Task[];
  onAddTask(draft: TaskDraft): void;
  onUpdateTask(id: string, draft: TaskDraft): void;
  onToggleTask(id: string): void;
  onDeleteTask(id: string): void;
}

export function TaskPanel({ selectedDate, tasks, onAddTask, onUpdateTask, onToggleTask, onDeleteTask }: TaskPanelProps) {
  const [modalState, setModalState] = useState<TaskEditorState | null>(null);
  const [filter, setFilter] = useState<TaskFilter>("selected");

  const visibleTasks = useMemo(
    () => filterTasks(tasks, filter, selectedDate).map(toTaskViewModel),
    [filter, selectedDate, tasks]
  );

  function openCreateModal() {
    setModalState({ mode: "create", draft: makeDefaultTaskDraft(selectedDate) });
  }

  function openEditModal(vm: TaskViewModel) {
    setModalState({ mode: "edit", taskId: vm.id, draft: vm.draft });
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>할 일</h2>
        <div className="panel-actions">
          <SegmentedControl
            ariaLabel="할 일 필터"
            options={taskFilters}
            value={filter}
            onChange={(next) => setFilter(next)}
          />
          <button className="primary-button" type="button" onClick={openCreateModal}>
            추가
          </button>
        </div>
      </div>
      <div className="panel-body">
        <EntryList
          items={visibleTasks}
          emptyLabel="항목 없음"
          renderItem={(vm) => (
            <EntryRow
              key={vm.id}
              className={vm.rowClassName}
              title={vm.title}
              tags={[vm.dueDateFormatted, vm.priorityLabel, ...(vm.reminderFormatted ? [vm.reminderFormatted] : [])]}
              note={vm.note}
              actions={
                <>
                  <button className="secondary-button" type="button" onClick={() => openEditModal(vm)}>
                    수정
                  </button>
                  <button className="secondary-button" type="button" onClick={() => onToggleTask(vm.id)}>
                    {vm.toggleLabel}
                  </button>
                  <button className="danger-button" type="button" onClick={() => onDeleteTask(vm.id)}>
                    삭제
                  </button>
                </>
              }
            />
          )}
        />
      </div>
      {modalState ? (
        <TaskEditorModal
          title={modalState.mode === "edit" ? "할 일 수정" : "할 일 추가"}
          initialDraft={modalState.draft}
          isEditing={modalState.mode === "edit"}
          onClose={() => setModalState(null)}
          onSubmit={(draft) => {
            if (modalState.mode === "edit") {
              onUpdateTask(modalState.taskId, draft);
            } else {
              onAddTask(draft);
            }
            setModalState(null);
          }}
        />
      ) : null}
    </section>
  );
}

const taskFilters: Array<{ value: TaskFilter; label: string }> = [
  { value: "selected", label: "선택일" },
  { value: "open", label: "진행" },
  { value: "done", label: "완료" },
  { value: "all", label: "전체" }
];
