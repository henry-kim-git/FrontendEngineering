import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EntryList, EntryRow } from "@/src/components/EntryList";

describe("EntryList", () => {
  it("항목이 없으면 emptyLabel을 보여준다", () => {
    render(<EntryList items={[]} emptyLabel="항목 없음" renderItem={() => null} />);
    expect(screen.getByText("항목 없음")).toBeInTheDocument();
  });

  it("항목이 있으면 emptyLabel 대신 각 항목을 렌더링한다", () => {
    render(
      <EntryList
        items={["a", "b"]}
        emptyLabel="항목 없음"
        renderItem={(item) => <span key={item}>{item}</span>}
      />
    );
    expect(screen.queryByText("항목 없음")).not.toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
  });
});

describe("EntryRow", () => {
  it("title, tags, note, actions를 모두 렌더링한다", () => {
    render(
      <EntryRow
        className="task-row"
        title="할 일 제목"
        tags={["태그1", "태그2"]}
        note="메모 내용"
        actions={<button type="button">삭제</button>}
      />
    );
    expect(screen.getByText("할 일 제목")).toBeInTheDocument();
    expect(screen.getByText("태그1")).toBeInTheDocument();
    expect(screen.getByText("태그2")).toBeInTheDocument();
    expect(screen.getByText("메모 내용")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
  });

  it("note가 없으면 렌더링하지 않는다", () => {
    render(<EntryRow className="task-row" title="제목" tags={[]} actions={null} />);
    expect(screen.queryByText("item-note")).not.toBeInTheDocument();
  });
});
