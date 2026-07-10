import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SegmentedControl } from "@/src/components/SegmentedControl";

const options = [
  { value: "open", label: "진행" },
  { value: "done", label: "완료" }
];

describe("SegmentedControl", () => {
  it("모든 옵션을 렌더링하고 현재 값에 active 클래스를 붙인다", () => {
    render(<SegmentedControl ariaLabel="필터" options={options} value="open" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "진행" })).toHaveClass("active");
    expect(screen.getByRole("button", { name: "완료" })).not.toHaveClass("active");
  });

  it("옵션 클릭 시 해당 value로 onChange를 호출한다", async () => {
    const onChange = vi.fn();
    render(<SegmentedControl ariaLabel="필터" options={options} value="open" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "완료" }));
    expect(onChange).toHaveBeenCalledWith("done");
  });
});
