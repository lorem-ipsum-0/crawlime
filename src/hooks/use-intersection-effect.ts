"use client";
import { useEffect, useRef } from "react";

export const useIntersectionEffect = <TElement extends HTMLElement>(
  onIntersecting: (entry: IntersectionObserverEntry) => void,
  deps: unknown[] = [],
) => {
  const ref = useRef<TElement | null>(null);
  const onIntersectingRef = useRef(onIntersecting);
  onIntersectingRef.current = onIntersecting;

  useEffect(() => {
    if (!ref?.current) {
      return;
    }

    const el = ref.current;
    const cb = onIntersectingRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log({ entry });
        if (entry?.isIntersecting) {
          cb(entry);
        }
      },
      { threshold: 1 },
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  return ref;
};
