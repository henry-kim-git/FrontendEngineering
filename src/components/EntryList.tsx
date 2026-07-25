"use client";

import type { ReactNode } from "react";

interface EntryListProps<T> {
  items: T[];
  emptyLabel: string;
  renderItem(item: T): ReactNode;
}

export function EntryList<T>({ items, emptyLabel, renderItem }: EntryListProps<T>) {
  return (
    <div className="list">
      {items.length === 0 ? <div className="empty-state">{emptyLabel}</div> : items.map(renderItem)}
    </div>
  );
}

interface EntryRowProps {
  className?: string;
  layout?: "row" | "stacked";
  title: string;
  tags: ReactNode[];
  extra?: ReactNode;
  note?: string | null;
  actions: ReactNode;
}

export function EntryRow({ className, layout = "row", title, tags, extra, note, actions }: EntryRowProps) {
  const rootClassName = ["entry-row", layout === "stacked" ? "entry-row--stacked" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={rootClassName}>
      <div className="item-line">
        <div>
          <div className="item-title">{title}</div>
          <div className="item-meta">
            {tags.map((tag, index) => (
              <span className="tag" key={index}>
                {tag}
              </span>
            ))}
          </div>
          {extra}
          {note ? <div className="item-note">{note}</div> : null}
        </div>
        <div className="row-actions">{actions}</div>
      </div>
    </article>
  );
}
