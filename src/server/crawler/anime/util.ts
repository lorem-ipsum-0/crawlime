import { env } from "~/env";

export const split = (value?: string, by = /\s*,\s*/) =>
  (value ?? "").split(by).filter(Boolean);

export const matchLine = (
  text: string,
  regexp: string | RegExp,
  lineRegexp: string | RegExp = regexp,
) =>
  split(text, /\n/)
    .find((item) => item.trim().match(lineRegexp))
    ?.trim()
    .match(regexp);

export const matchLineGroups = <T extends string>(
  text: string,
  regexp: string | RegExp,
  lineRegexp: string | RegExp = regexp,
) =>
  (matchLine(text, regexp, lineRegexp)?.groups ?? {}) as Partial<
    Record<T, string>
  >;

export const matchGroups = <T extends string>(
  text: string,
  regexp: string | RegExp,
) => (text.match(regexp)?.groups ?? {}) as Partial<Record<T, string>>;

export const matchSlug = (url: string) =>
  url.match(/\/(?<slug>\d+-.+)\.html/)?.groups?.slug ?? "";

export const matchId = (url: string) =>
  url.match(/\/(?<id>\d+)-.+\.html/)?.groups?.id ?? "";

export const tryMap = <T, D = null>(
  cb: () => T,
  defaultValue: D | null = null,
) => {
  try {
    return cb();
  } catch {
    return defaultValue;
  }
};

export const resolveUrl = (url?: string) =>
  tryMap(() => (url ? new URL(url, env.TARGET_URL).toString() : null));

export const parseDate = (dateString: string): string | null => {
  const monthMap: Record<string, number> = {
    січ: 0,
    лют: 1,
    бер: 2,
    кві: 3,
    тра: 4,
    чер: 5,
    лип: 6,
    сер: 7,
    вер: 8,
    жов: 9,
    лис: 10,
    гру: 11,
  };

  const { day = "", month = "" } =
    dateString.match(/(?<day>\d{2})(?<month>[а-я]{3})/i)?.groups ?? {};
  const parsedDay = parseInt(day, 10);
  const parsedMonth = monthMap[month];

  return tryMap(() =>
    parsedDay != null && parsedMonth != null
      ? new Date(new Date().getFullYear(), parsedMonth, parsedDay).toISOString()
      : null,
  );
};

export const parseDuration = (timeString?: string): number | null => {
  const regex = /(?:(\d+) год\.)?\s*(?:(\d+) хв\.)?/i;
  const match = timeString?.match(regex);

  if (match) {
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;

    const totalMinutes = hours * 60 + minutes;

    return totalMinutes;
  }

  return null;
};

export const parseNumber = (episode?: string) =>
  episode != null && !Number.isNaN(parseFloat(episode))
    ? parseFloat(episode)
    : null;
