"use client";

import { cn } from "~/ui/utils/cn";

export const AnimeSpecials = ({
  className,
  values,
}: {
  className?: string;
  values: string[];
}) =>
  values.length ? (
    <div className={cn("flex gap-2", className)}>
      {values.map((name) => (
        <div key={name}>
          +{" "}
          <span
            key={name}
            className="font-medium text-cyan-600 dark:text-cyan-200"
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ) : null;
AnimeSpecials.displayName = "AnimeSpecials";
