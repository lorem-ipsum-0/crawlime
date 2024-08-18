"use client";

import { Badge } from "~/ui/badge";
import { cn } from "~/ui/utils/cn";

export const AnimeCategories = ({
  className,
  values,
}: {
  className?: string;
  values: { name: string }[];
}) =>
  values?.length ? (
    <ul className={cn("inline-flex flex-wrap gap-1.5", className)}>
      {values.map(({ name }) => (
        <li key={name}>
          <Badge>{name}</Badge>
        </li>
      ))}
    </ul>
  ) : null;

AnimeCategories.displayName = "AnimeCategories";
