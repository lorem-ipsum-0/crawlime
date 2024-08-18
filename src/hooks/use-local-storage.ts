"use client";

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";

const dispatchStorageEvent = <T extends string | null | undefined>(
  key: string,
  newValue: T,
) => window.dispatchEvent(new StorageEvent("storage", { key, newValue }));

const setLocalStorageItem = <T>(key: string, value: T) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getLocalStorageItem = (key: string) => window.localStorage.getItem(key);

const useLocalStorageSubscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getLocalStorageServerSnapshot = () => null;

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const getSnapshot = () => getLocalStorageItem(key);

  const store = useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot,
    getLocalStorageServerSnapshot,
  );

  const setState = useCallback(
    (updater: SetStateAction<T>) => {
      try {
        const nextState =
          typeof updater === "function"
            ? (updater as (prev: T) => T)(JSON.parse(store!) as T)
            : updater;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store],
  );

  useEffect(() => {
    if (
      getLocalStorageItem(key) === null &&
      typeof initialValue !== "undefined"
    ) {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  return [store ? (JSON.parse(store) as T) : initialValue, setState];
}
