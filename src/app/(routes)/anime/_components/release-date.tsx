"use client";

export const AnimeReleaseDate = ({ years }: { years: number[] }) =>
  years.length ? (
    <div>
      {years.length > 1 ? "Роки" : "Рік"} виходу{" "}
      <span className="font-semibold text-foreground">{years.join(", ")}</span>
    </div>
  ) : null;
AnimeReleaseDate.displayName = "AnimeReleaseDate";
