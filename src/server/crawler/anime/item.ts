import axios from "axios";
import { load, type CheerioAPI } from "cheerio";
import { writeFileSync } from "fs";
import { type AnimeFull } from "./types";
import {
  matchGroups,
  matchLineGroups,
  parseDate,
  parseDuration,
  parseNumber,
  resolveUrl,
  split,
} from "./util";
import { env } from "~/env";

export interface PageContext {
  slug: string;
}

const parsePage = ($page: CheerioAPI, { slug }: PageContext): AnimeFull => {
  const id = matchGroups(slug, /(?<id>\d+)-/).id ?? "";

  const $story = $page(".story .story_c");
  const $preview = $page(".story .story_screens a");

  const detailsText = $story
    .find(".story_c_r")
    .filter((_, el) => !!$page(el).parent(":not(.rollover)").length)
    .text()
    .replace(
      /(?:(\s)\((?:\d+ год\.|\d+ год\. \d+ хв\.|\d+ хв\.)+\))/,
      (s) => " " + s.trim(),
    );

  const lineGroups = <T extends string>(
    text: string,
    regexp: string | RegExp,
    lineRegexp?: string | RegExp,
  ) => matchLineGroups<T>(text, regexp, lineRegexp);

  const getDetails = (text: string) => ({
    ...lineGroups<"years">(
      text,
      /^Рік (?:виходу|випуску) аніме: (?<years>(?:\d+(?:, )?)+)$/,
    ),
    ...lineGroups<
      | "currentEpisode"
      | "totalEpisodes"
      | "duration"
      | "specials1"
      | "specials2"
    >(
      text,
      /^Серій: (?<currentEpisode>\d+)(?: \(.+\))?(?: і?з (?<totalEpisodes>\d+|ХХ))((?: (?<specials1>(?:\+ ([^+]+))+))?(?:\s\((?<duration>(?:\d+ год\.|\d+ год\. \d+ хв\.|\d+ хв\.)+)\))|(?<specials2>\+ .*)?)$/,
    ),
    ...lineGroups<"categories">(text, /^Жанр: (?<categories>.+?)$/),
    ...lineGroups<"translations">(
      text,
      /^(?:Перекладали|Переклад): (?<translations>.+?)$/,
    ),
    ...lineGroups<"voices">(text, /^Ролі озвучували: (?<voices>.+)$/),
  });

  const details = getDetails(detailsText);

  const translationsAlt = $story
    .find(".story_c_r .teams")
    .filter(
      (_, el) =>
        !!$page(el).parent(":not(.team_list)").length &&
        !$page(el).find(">.teams").length,
    )
    .map((_, el) =>
      $page(el)
        .contents()
        .filter((_, el) => (el.type as string) === "text")
        .text(),
    )
    .get();

  const voicesAlt = $story
    .find(".story_c_r .team_list")
    .map((_, el) =>
      [
        $page(el).find(">b").text(),
        $page(el)
          .find(".teams")
          .map((_, el) => $page(el).text())
          .get()
          .join(", "),
      ].join(""),
    )
    .get();

  return {
    id,
    slug,
    url: resolveUrl(`${slug}.html`)!,
    imageUrl: resolveUrl(
      $story.find(".story_c_left .story_post img").attr("src"),
    ),
    title: $story.find(".rcol > h2").text().trim(),
    description: $story
      .find(".story_c_text .my-text")
      .contents()
      .filter((_, el) => (el.type as string) === "text")
      .text()
      .trim(),
    rating: parseNumber(
      $page(".multirating-itog-rateval").text().trim() ||
        $page(".story_c_rate")
          .text()
          .trim()
          .match(/(?<rating>\d+(?:\.\d+))\/\d+/)?.groups?.rating,
    ),
    lastUpdateDate: parseDate($story.find(".story_datenew").text()),
    age: $story.find(".story_age_1").text().trim() || null,
    years: split(details.years).map(Number),
    currentEpisode: parseNumber(details.currentEpisode),
    totalEpisodes: parseNumber(details.totalEpisodes),
    duration: parseDuration(details.duration),
    specials: [
      ...split(details.specials1, /\s*\+\s*/),
      ...split(details.specials2, /\s*\+\s*/),
    ],
    categories: split(details.categories).map((name) => ({ name })),
    subAuthors: translationsAlt.length
      ? translationsAlt.map((name) => ({ name }))
      : split(details.translations).map((name) => ({ name })),
    voiceActors: voicesAlt.length
      ? voicesAlt.flatMap((voice) => {
          const [group, actors] = split(voice, /\s*\:\s*/);
          return split(actors).map((name) => ({ group, name }));
        })
      : split(details.voices).map((name) => ({ name })),
    preview: $preview
      .map((_, el) => ({
        imageUrl: resolveUrl($page(el).attr("href")),
        thumbnailUrl: resolveUrl(
          $page(el).find("img").attr("data-src") ??
            $page(el).find("img").attr("src"),
        ),
      }))
      .get(),
    trailer: {
      embedId:
        $story
          .find(".rollover")
          .attr("href")
          ?.match(/watch\?v=(?<id>.*)/)?.groups?.id ?? null,
      videoUrl: $story.find(".rollover").attr("href") ?? null,
      thumbnailUrl: resolveUrl(
        $story.find(".rollover .trailer_preview img").attr("src"),
      ),
    },
    related: $page(".news.fran")
      .parent("a")
      .map((_, el) => {
        const url = $page(el).attr("href")?.trim() ?? "";
        const details = getDetails($page(el).find(".news_r").text());
        return {
          id: url.match(/\/(?<id>\d+)-.+\.html/)?.groups?.id ?? "",
          slug: url.match(/\/(?<slug>\d+-.+)\.html/)?.groups?.slug ?? "",
          url: resolveUrl(url),
          imageUrl: resolveUrl(
            $page(el).find("img").attr("data-src") ??
              $page(el).find("img").attr("src"),
          ),
          title: $page(el).find(".news_r_h .link").text().trim(),
          description: $page(el).find(".news_r_c").text().trim(),
          audioType: $page(el).find(".dubsub,.ukr,.sub").html(),
          years: split(details.years).map(Number),
          currentEpisode: parseNumber(details.currentEpisode),
          totalEpisodes: parseNumber(details.totalEpisodes),
          duration: parseDuration(details.duration),
        };
      })
      .get(),
    similar: $page(".portfolio_items .sl_bg")
      .map((_, el) => {
        const url = $page(el).find("a").attr("href")?.trim() ?? "";
        return {
          id: url.match(/\/(?<id>\d+)-.+\.html/)?.groups?.id ?? "",
          slug: url.match(/\/(?<slug>\d+-.+)\.html/)?.groups?.slug ?? "",
          url: resolveUrl(url),
          imageUrl: resolveUrl(
            $page(el).find("img").attr("data-src") ??
              $page(el).find("img").attr("src"),
          ),
          title: $page(el).find(".text_content").text().trim(),
        };
      })
      .get(),
  };
};

export interface GetAniParams {
  slug: string;
}

export const getAnime = async ({ slug }: GetAniParams) => {
  return await axios
    .get<string>(`${env.TARGET_URL}/${slug}.html`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0",
      },
    })
    .then((res) => parsePage(load(res.data), { slug }))
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
