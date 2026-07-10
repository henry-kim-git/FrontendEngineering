"use client";

import { useEffect } from "react";

export function useLocalStorageSync<T>(value: T | undefined, save: (value: T) => void): void {
  useEffect(() => {
    if (value === undefined) return;
    save(value);
  }, [value, save]);
}
