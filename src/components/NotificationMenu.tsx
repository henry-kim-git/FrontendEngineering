"use client";

import { useState } from "react";
import { filterNotifications, formatDateTime, sortNotificationsByTime } from "@/src/planner";
import type { NotificationFilter, PlannerNotification } from "@/src/planner";
import { EntryList, EntryRow } from "@/src/components/EntryList";
import { SegmentedControl } from "@/src/components/SegmentedControl";

interface NotificationMenuProps {
  notifications: PlannerNotification[];
  onRead(id: string): void;
  onSnooze(id: string, minutes: number): void;
}

export function NotificationMenu({ notifications, onRead, onSnooze }: NotificationMenuProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("ready");
  const readyCount = notifications.filter((notification) => notification.status === "ready").length;

  const visibleNotifications = sortNotificationsByTime(filterNotifications(notifications, filter));

  return (
    <div className="notification-menu-wrap">
      <button
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
      >
        알림
        {readyCount > 0 ? <span className="menu-badge">{readyCount}</span> : null}
      </button>

      {open ? (
        <div className="notification-menu-popover" role="menu">
          <div className="panel-header">
            <h2>알림</h2>
            <button className="icon-button" type="button" aria-label="알림 닫기" onClick={() => setOpen(false)}>
              X
            </button>
          </div>
          <div className="panel-body">
            <SegmentedControl
              ariaLabel="알림 필터"
              className="notification-filter"
              options={notificationFilters}
              value={filter}
              onChange={(next) => setFilter(next)}
            />

            <div className="notification-list">
              <EntryList
                items={visibleNotifications}
                emptyLabel="알림 없음"
                renderItem={(notification) => (
                  <EntryRow
                    key={notification.id}
                    className={`notification-row ${notification.status}`}
                    title={notification.title}
                    tags={[statusLabel[notification.status], formatDateTime(notification.notifyAt)]}
                    extra={<div className="item-meta">{notification.body}</div>}
                    actions={
                      <>
                        <button className="secondary-button" type="button" onClick={() => onSnooze(notification.id, 10)}>
                          +10분
                        </button>
                        <button className="primary-button" type="button" onClick={() => onRead(notification.id)}>
                          확인
                        </button>
                      </>
                    }
                  />
                )}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const notificationFilters: Array<{ value: NotificationFilter; label: string }> = [
  { value: "ready", label: "도착" },
  { value: "scheduled", label: "예정" },
  { value: "read", label: "확인" },
  { value: "all", label: "전체" }
];

const statusLabel: Record<PlannerNotification["status"], string> = {
  scheduled: "예정",
  ready: "도착",
  read: "확인"
};
