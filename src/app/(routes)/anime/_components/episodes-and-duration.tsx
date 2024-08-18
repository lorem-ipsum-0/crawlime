import { IconClockFilled } from "@tabler/icons-react";
import { intervalToDuration } from "date-fns";
import { cn } from "~/ui/utils/cn";

const cardinalRules = new Intl.PluralRules("ua");

export const AnimeEpisodes = ({
  currentEpisode,
  totalEpisodes,
}: {
  currentEpisode: number;
  totalEpisodes?: number | null;
}) => {
  return (
    <>
      <span className="font-semibold text-foreground">{currentEpisode}</span> з{" "}
      <span className="font-semibold text-foreground">
        {totalEpisodes ?? "??"}
      </span>{" "}
      {
        {
          zero: "серій",
          one: "серія",
          two: "серії",
          few: "серій",
          many: "серій",
          other: "серій",
        }[cardinalRules.select(totalEpisodes ?? 0)]
      }
    </>
  );
};
AnimeEpisodes.displayName = "AnimeEpisodes";

export const AnimeDuration = ({
  duration,
  status,
}: {
  duration: number;
  status: "ongoing" | "finished";
}) => {
  const parsedDuration = duration
    ? intervalToDuration({
        start: new Date(0),
        end: new Date(duration * 60 * 1000),
      })
    : null;

  const durationText = parsedDuration ? (
    <>
      {parsedDuration.hours ? (
        <>
          <span className="font-semibold text-foreground">
            {parsedDuration.hours}
          </span>{" "}
          год.{" "}
        </>
      ) : null}
      {parsedDuration.minutes ? (
        <>
          <span className="font-semibold text-foreground">
            {parsedDuration.minutes}
          </span>{" "}
          хв.{" "}
          <IconClockFilled
            className={cn("me-1.5 inline-block h-2.5 w-2.5", {
              "text-green-500": status === "finished",
              "text-amber-500": status === "ongoing",
            })}
          />
        </>
      ) : null}
    </>
  ) : null;

  return <>{durationText}</>;
};
AnimeDuration.displayName = "AnimeDuration";

export const AnimeEpisodesAndDuration = ({
  className,
  currentEpisode,
  totalEpisodes,
  duration,
}: {
  className?: string;
  currentEpisode?: number | null;
  totalEpisodes?: number | null;
  duration?: number | null;
}) => {
  return (
    <>
      {currentEpisode && (!totalEpisodes || totalEpisodes > 1) ? (
        <div className={className}>
          <AnimeEpisodes
            currentEpisode={currentEpisode}
            totalEpisodes={totalEpisodes}
          />{" "}
          {duration ? (
            <>
              по{" "}
              <AnimeDuration
                duration={duration}
                status={
                  currentEpisode === totalEpisodes ? "finished" : "ongoing"
                }
              />
            </>
          ) : null}
        </div>
      ) : duration ? (
        <div className={className}>
          тривалість <AnimeDuration duration={duration} status="finished" />
        </div>
      ) : null}
    </>
  );
};
AnimeEpisodesAndDuration.displayName = "AnimeEpisodesAndDuration";
