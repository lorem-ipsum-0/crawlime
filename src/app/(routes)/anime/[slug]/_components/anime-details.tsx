"use client";
import {
  IconExternalLink,
  IconLanguageHiragana,
  IconMicrophone,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";
import { Fragment } from "react";
import {
  type AnimeFull,
  type PlaylistNode,
} from "~/server/crawler/anime/types";
import { Badge } from "~/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/ui/carousel";
import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from "~/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/ui/tooltip";
import { AnimeCategories } from "../../_components/categories";
import { AnimeEpisodesAndDuration } from "../../_components/episodes-and-duration";
import { AnimeReleaseDate } from "../../_components/release-date";
import { AnimeVoiceAndSubs } from "../../_components/voice-and-subs";
import { Playlist } from "./playlist";
import { Thumbnails } from "./thumbnails";

export const AnimeDetails = ({
  item,
  playlist,
}: {
  item: AnimeFull;
  playlist: PlaylistNode[];
}) => {
  const voiceActorsByBand = item.voiceActors.reduce(
    (memo, { group = "none", name }) => ({
      ...memo,
      [group]: [...(memo[group] ?? []), name],
    }),
    {} as Record<string, string[]>,
  );

  return (
    <article className="mb-4 flex flex-col gap-y-6">
      <div className="container">
        <Playlist id={item.id} nodes={playlist} />
      </div>
      <div className="flex flex-col gap-4 bg-foreground/5 py-6">
        <div className="container flex flex-col justify-start gap-x-4 gap-y-6 md:flex-row">
          <div className="mx-auto aspect-[6/9] basis-64 md:min-w-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="size-full max-h-96 rounded-lg object-cover"
              src={item.imageUrl ?? ""}
              alt={item.title}
            />
          </div>
          <div className="flex flex-col gap-2 leading-normal">
            <h2 className="flex items-center gap-4 text-2xl font-semibold tracking-tight text-foreground">
              {item.title}{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipContent>Відкрити оригінал</TooltipContent>
                  <TooltipTrigger asChild>
                    <a
                      className="now ml-auto"
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.rating}{" "}
                      <IconExternalLink className="inline-block size-4" />
                    </a>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </h2>
            <AnimeEpisodesAndDuration
              currentEpisode={item.currentEpisode}
              totalEpisodes={item.totalEpisodes}
              duration={item.duration}
            />
            <AnimeReleaseDate years={item.years} />
            <AnimeCategories values={item.categories} />
            <p>{item.description}</p>
            <div className="mb-4 grid grid-cols-[1fr_11fr] items-start gap-2">
              {item.voiceActors.length ? (
                <>
                  <div className="inline-flex items-center gap-2 text-sm font-medium">
                    <IconMicrophone className="h-4 w-4" />
                    Озвучення:
                  </div>
                  <div className="inline-flex flex-wrap gap-2">
                    {Object.entries(voiceActorsByBand).map(([band, actors]) => {
                      return (
                        <Fragment key={band + actors.join("")}>
                          {band !== "none" ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button type="button">
                                  <Badge variant="outline">
                                    {band}{" "}
                                    <IconUsersGroup className="ml-1 size-3" />
                                  </Badge>
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="max-w-sm" side="top">
                                <div className="text-pretty text-center text-sm">
                                  {actors.map((actor) => (
                                    <Fragment key={actor}>
                                      <span className="[&~&::before]:content-[',_']">
                                        {actor}
                                      </span>
                                    </Fragment>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            actors.map((actor) => (
                              <Badge key={actor} variant="outline">
                                {actor} <IconUser className="ml-1 size-2" />
                              </Badge>
                            ))
                          )}
                        </Fragment>
                      );
                    })}
                  </div>
                </>
              ) : null}
              {item.subAuthors.length ? (
                <>
                  <div className="inline-flex items-center gap-2 text-sm font-medium">
                    <IconLanguageHiragana className="h-4 w-4" />
                    Переклад:
                  </div>
                  <div className="inline-flex flex-wrap gap-2">
                    {item.subAuthors.map(({ name: translator }) => (
                      <Badge key={translator} variant="outline">
                        {translator} <IconUser className="ml-1 size-2" />
                      </Badge>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="container flex items-start justify-center">
          <Thumbnails preview={item.preview} trailer={item.trailer} />
        </div>
      </div>
      {item.related.length ? (
        <div className="container">
          <h3 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
            Повʼязане
          </h3>
          <Carousel>
            <CarouselContent>
              {item.related.map((relatedItem) => (
                <CarouselItem
                  key={relatedItem.id}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/6 xl:basis-[calc(100%/8)]"
                >
                  <HoverCard>
                    <HoverCardPortal>
                      <HoverCardContent
                        side="right"
                        sideOffset={8}
                        align="start"
                        alignOffset={-2}
                        collisionPadding={12}
                        className="flex w-full max-w-xs flex-col gap-1 text-sm"
                      >
                        <div className="mb-2 text-base font-semibold leading-none tracking-tight">
                          {relatedItem.title}
                        </div>
                        <AnimeReleaseDate years={item.years} />
                        <AnimeEpisodesAndDuration
                          currentEpisode={relatedItem.currentEpisode}
                          totalEpisodes={relatedItem.totalEpisodes}
                          duration={relatedItem.duration}
                        />
                        <AnimeVoiceAndSubs type={relatedItem.audioType} />
                        <p className="mt-2 line-clamp-4">
                          {relatedItem.description}
                        </p>
                      </HoverCardContent>
                    </HoverCardPortal>
                    <HoverCardTrigger asChild>
                      <Link
                        className="flex flex-col gap-2 text-sm"
                        href={`/anime/${relatedItem.slug}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="aspect-[3/4] w-full rounded-xl"
                          src={relatedItem.imageUrl ?? ""}
                          alt=""
                        />
                        <div className="line-clamp-2">{relatedItem.title}</div>
                      </Link>
                    </HoverCardTrigger>
                  </HoverCard>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      ) : null}
      {item.similar.length ? (
        <div className="container">
          <h3 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
            Рекомендації
          </h3>
          <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-center">
            {item.similar.map((similarItem) => (
              <div
                key={similarItem.id}
                className="basis-1/3 pl-4 pt-4 lg:basis-1/6"
              >
                <Link
                  href={`/anime/${similarItem.slug}`}
                  className="flex flex-col gap-2 text-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="aspect-[3/4] w-full rounded-xl"
                    src={similarItem.imageUrl ?? ""}
                    alt=""
                  />
                  <div className="line-clamp-2">{similarItem.title}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
};
