import { useEffect, useMemo, useState } from "react";

const isBrowser = () => typeof window !== "undefined";

export const createBreakpoint =
  <T extends Record<string, number>>(breakpoints: T) =>
  () => {
    const [screen, setScreen] = useState(isBrowser() ? window.innerWidth : 0);

    useEffect(() => {
      const setSideScreen = (): void => {
        setScreen(window.innerWidth);
      };
      setSideScreen();
      window.addEventListener("resize", setSideScreen);
      return () => {
        window.removeEventListener("resize", setSideScreen);
      };
    });

    const sortedBreakpoints = useMemo(
      () => Object.entries(breakpoints).sort((a, b) => (a[1] >= b[1] ? 1 : -1)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [breakpoints],
    ) as [keyof T, T[keyof T]][];

    const result = sortedBreakpoints.reduce((acc, [name, width]) => {
      if (screen >= width) {
        return name;
      } else {
        return acc;
      }
    }, sortedBreakpoints[0]![0]);

    return result;
  };

export const useBreakpoint = createBreakpoint({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
});
