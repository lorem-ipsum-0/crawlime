"use client";
import { type RefObject, useEffect, useRef } from "react";

export const useIntersectionEffect = (
  ref: RefObject<HTMLElement>,
  onIntersecting: (entry: IntersectionObserverEntry) => void,
  deps: unknown[] = [],
) => {
  const onIntersectingRef = useRef(onIntersecting);
  onIntersectingRef.current = onIntersecting;

  useEffect(() => {
    if (!ref?.current) {
      return;
    }

    const el = ref.current;
    const cb = onIntersectingRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        cb(entry);
      }
    });

    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
};
