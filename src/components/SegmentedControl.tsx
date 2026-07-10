"use client";

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange(value: T): void;
  ariaLabel: string;
  className?: string;
}

export function SegmentedControl<T extends string>({ options, value, onChange, ariaLabel, className }: SegmentedControlProps<T>) {
  return (
    <div className={className ? `segmented ${className}` : "segmented"} aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          className={value === option.value ? "active" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
