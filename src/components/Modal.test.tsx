import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "@/src/components/Modal";

describe("Modal", () => {
  it("title과 children을 렌더링한다", () => {
    render(
      <Modal title="일정 추가" onClose={() => {}}>
        <p>본문 내용</p>
      </Modal>
    );
    expect(screen.getByText("일정 추가")).toBeInTheDocument();
    expect(screen.getByText("본문 내용")).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 onClose를 호출한다", async () => {
    const onClose = vi.fn();
    render(
      <Modal title="일정 추가" onClose={onClose}>
        <p>본문 내용</p>
      </Modal>
    );
    await userEvent.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
