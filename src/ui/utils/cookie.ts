const getCookies = () =>
  Object.fromEntries(
    typeof document !== "undefined"
      ? document.cookie.split(/;\s*/).map((value) => value.split("="))
      : [],
  ) as Record<string, string>;

export const cookies = () => ({
  get: (name: string) => getCookies()[name],
  set: (
    name: string,
    value: string,
    { maxAge, path }: { maxAge?: number; path?: string } = {},
  ) =>
    (document.cookie = `${[name, value].join("=")}${maxAge != null ? `;max-age=${maxAge}` : ""}${path ? `;path=${path}` : ""}`),
});
