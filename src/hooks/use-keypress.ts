"use client";
import { useEffect, useRef } from "react";

export const useKeyPress = (bindings: Record<string, () => void>) => {
  const cbRef = useRef(bindings);
  cbRef.current = bindings;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      cbRef.current[e.key]?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
};
