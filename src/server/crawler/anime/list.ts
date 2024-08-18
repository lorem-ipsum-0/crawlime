import axios from "axios";
import { type Cheerio, type CheerioAPI, type Element, load } from "cheerio";
import { type AnimePreview } from "./types";
import {
  matchLineGroups,
  parseDate,
  parseDuration,
  parseNumber,
  resolveUrl,
  split,
} from "./util";
import { env } from "~/env";

export const parseStory = ($story: Cheerio<Element>): AnimePreview => {
  const $titleLink = $story.find('h2[itemprop="name"] a');
  const url = $titleLink.attr("href") ?? "";
  const imageUrl = $story.find(".story_c_l .story_post img").attr("src") ?? "";

  const detailsText = $story.find(".story_infa").text();

  const lineGroups = <T extends string>(regexp: string | RegExp) =>
    matchLineGroups<T>(detailsText, regexp);

  const details = {
    ...lineGroups<"years">(
      /^Рік (?:виходу|випуску) аніме: (?<years>(?:\d+(?:, )?)+)$/,
    ),
    ...lineGroups<
      | "currentEpisode"
      | "totalEpisodes"
      | "duration"
      | "specials1"
      | "specials2"
    >(
      /^Серій: (?<currentEpisode>\d+)(?: \(.+\))?(?: і?з (?<totalEpisodes>\d+|ХХ))((?: (?<specials1>(?:\+ ([^+]+))+))?(?: \((?<duration>(?:\d+ год\.|\d+ год\. \d+ хв\.|\d+ хв\.)+)\))|(?<specials2>\+ .*)?)$/,
    ),
    ...lineGroups<"categories">(/^Категорія: (?<categories>.+?)$/),
    ...lineGroups<"translations">(
      /^(?:Перекладали|Переклад): (?<translations>.+?)$/,
    ),
    ...lineGroups<"voices">(/^Ролі озвучували: (?<voices>.+)$/),
  };

  return {
    id: url.match(/\/(?<id>\d+)-.+\.html/)?.groups?.id ?? "",
    slug: url.match(/\/(?<slug>\d+-.+)\.html/)?.groups?.slug ?? "",
    url: resolveUrl(url)!,
    imageUrl: resolveUrl(imageUrl),
    title: $titleLink.text().trim(),
    description: $story.find(".story_c_text").text().trim(),
    audioType: $story.find(".dubsub,.ukr,.sub").text().trim(),
    age: $story.find(".story_age_1").text().trim() || null,
    rating: parseNumber(
      $story
        .find(".story_c_rate")
        .text()
        .trim()
        .match(/(?<rating>\d+(?:\.\d+))\/\d+/)?.groups?.rating,
    ),
    updateReason: $story.find(".story_link").text().trim(),
    // NOTE: it's always in current year
    lastUpdateDate: parseDate($story.find(".story_date").text()),
    years: split(details.years).map(Number),
    currentEpisode: parseNumber(details.currentEpisode),
    totalEpisodes: parseNumber(details.totalEpisodes),
    duration: parseDuration(details.duration),
    specials: [
      ...split(details.specials1, /\s*\+\s*/),
      ...split(details.specials2, /\s*\+\s*/),
    ],
    categories: split(details.categories).map((name) => ({ name })),
    subAuthors: split(details.translations).map((name) => ({ name })),
    voiceActors: split(details.voices).map((name) => ({ name })),
  };
};

export const parsePage = ($page: CheerioAPI) => ({
  list: $page(".story")
    .map((_, el) => parseStory($page(el)))
    .get(),
  hasMore: !!$page('.navigation a:contains("Наступна")').length,
});

export interface GetAnimeListParams {
  term?: string | null;
  localization?: ("SUB" | "DUB")[];
  type?: (
    | "ТБ"
    | "Повнометражне"
    | "ТБ-спешл"
    | "Короткометражне"
    | "OVA"
    | "ONA"
  )[];
  genre?: string[];
  year?: [string, string];
  rating?: [string, string];
  page?: number;
  sortBy?: "date" | "title" | "year" | "comm_num" | "news_read" | "rating";
  sortDir?: "asc" | "desc";
}

export const getAnimeList = async ({
  term,
  localization,
  type,
  genre,
  year,
  rating,
  page = 1,
  sortBy = "date",
  sortDir = "desc",
}: GetAnimeListParams = {}) => {
  const url = `${env.TARGET_URL}/f/l.title=${encodeURIComponent(
    (term ?? "").replace(/ /g, "+"),
  )}${[
    localization?.length ? `/ne-chpati=${localization.join(",")}` : "",
    type?.length ? `/type=${type.join(",")}` : "",
    genre?.length ? `/cat=${genre.join(",")}` : "",
    year?.length ? `/r.year=${year.join(";")}` : "",
    rating?.length ? `/r.real_rating=${rating.join(";")}` : "",
  ].join("")}/sort=${sortBy}/order=${sortDir}/page/${page}`;

  return await axios
    .get<string>(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0",
      },
    })
    .then((res) => parsePage(load(res.data)));
};
