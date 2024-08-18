import { NextResponse } from "next/server";
import { getAnimeList } from "~/server/crawler/anime/list";

const fromSearchParams = (searchParams: URLSearchParams) => {
  return [...searchParams.entries()].reduce(
    (memo, [key, value]) => {
      const fixedKey = key.replace(/\[\]/, "");
      return {
        ...memo,
        [fixedKey]: key.match(/\[\]/)
          ? [...(memo[fixedKey] ?? []), value]
          : value,
      };
    },
    {} as Record<string, string | string[]>,
  );
};

export async function GET(request: Request) {
  const url = new URL(request.url);

  const { page, ...params } = fromSearchParams(url.searchParams);

  return NextResponse.json(
    await getAnimeList({
      ...params,
      page: Number(page ?? "1"),
    }),
  );
}
