"use client";

import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button, type ButtonProps } from "~/ui/button";
import { cookies } from "~/ui/utils/cookie";

export const ModeButton = (props: ButtonProps) => {
  const [darkMode, setDarkMode] = useState(
    () => cookies().get("crawlime.theme-mode") === "dark",
  );
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    cookies().set("crawlime.theme-mode", darkMode ? "dark" : "light", {
      maxAge: 34560000,
      path: "/",
    });
  }, [darkMode]);

  return mounted ? (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => setDarkMode((darkMode) => !darkMode)}
      {...props}
    >
      {darkMode ? <IconSunFilled /> : <IconMoonFilled />}
    </Button>
  ) : null;
};
