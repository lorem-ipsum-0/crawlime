"use client";

import { IconNews, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { forwardRef, useState } from "react";
import { useBreakpoint } from "~/hooks/use-breakpoint";
import { type AnimePreview } from "~/server/crawler/anime/types";
import { Badge } from "~/ui/badge";
import { Button } from "~/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/ui/drawer";
import { ErrorBoundary } from "~/ui/error";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/ui/hover-card";
import { AnimeCategories } from "./categories";
import { AnimeEpisodesAndDuration } from "./episodes-and-duration";
import { AnimeReleaseDate } from "./release-date";
import { AnimeSpecials } from "./specials";
import { AnimeVoiceAndSubs } from "./voice-and-subs";

export const AnimeCard = forwardRef<HTMLDivElement, { item: AnimePreview }>(
  ({ item }, ref) => {
    const breakpoint = useBreakpoint();
    const [open, setOpen] = useState(false);

    const renderImage = () => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="mb-2 size-full rounded-md object-cover shadow-md"
        loading="lazy"
        src={item.imageUrl ?? ""}
        alt={item.title}
      />
    );
    const renderTitle = () => (
      <h3 className="py-1 text-sm text-foreground">{item.title}</h3>
    );

    const renderContent = () => (
      <div className="flex h-full flex-col items-start gap-x-4 gap-y-2">
        {item.rating ? (
          <Badge className="absolute right-3 top-3 w-8">{item.rating}</Badge>
        ) : null}
        <AnimeReleaseDate years={item.years} />
        <AnimeEpisodesAndDuration
          currentEpisode={item.currentEpisode}
          totalEpisodes={item.totalEpisodes}
          duration={item.duration}
        />
        <AnimeSpecials values={item.specials} />
        <AnimeVoiceAndSubs type={item.audioType} />
        <AnimeCategories className="mt-2" values={item.categories} />
        <p className="my-2 line-clamp-6">{item.description}</p>
      </div>
    );

    const renderViewButton = () => (
      <>
        <div className="mt-2 w-full text-balance text-center text-xs leading-tight text-muted-foreground">
          <IconNews className="mb-0.5 inline-block size-3" />{" "}
          {item.updateReason}
        </div>
        <Button asChild>
          <Link href={`anime/${item.slug}`}>Переглянути</Link>
        </Button>
      </>
    );

    return (
      <article ref={ref} className="group relative aspect-[6/9]">
        {item.currentEpisode ? (
          <Badge
            variant="secondary"
            className="absolute right-1 top-1 opacity-80"
          >
            {item.currentEpisode} / {item.totalEpisodes ?? "??"}
          </Badge>
        ) : null}
        {breakpoint === "sm" || breakpoint === "md" ? (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="max-h-screen">
              <DrawerHeader>
                <DrawerTitle className="pr-3">{item.title}</DrawerTitle>
                <DrawerClose>
                  <IconX
                    aria-label="Закрити"
                    className="absolute right-2 top-2 size-5 text-muted"
                  />
                </DrawerClose>
              </DrawerHeader>
              <div className="overflow-y-auto px-4">{renderContent()}</div>
              <DrawerFooter>{renderViewButton()}</DrawerFooter>
            </DrawerContent>
            <DrawerTrigger asChild>
              <button className="size-full">
                {renderImage()}
                {renderTitle()}
              </button>
            </DrawerTrigger>
          </Drawer>
        ) : (
          <ErrorBoundary>
            <HoverCard open={open} onOpenChange={setOpen}>
              <HoverCardContent
                className="relative w-full max-w-sm text-sm"
                side="right"
                sideOffset={12}
                align="start"
                alignOffset={-10}
                collisionPadding={12}
                hideWhenDetached
              >
                <div className="mb-4 pr-10 text-lg font-semibold leading-none tracking-tight">
                  {item.title}
                </div>
                <div>{renderContent()}</div>
                <div className="flex flex-col gap-2">{renderViewButton()}</div>
              </HoverCardContent>
              <HoverCardTrigger asChild>
                <Link href={`anime/${item.slug}`} className="size-full">
                  {renderImage()}
                  {renderTitle()}
                </Link>
              </HoverCardTrigger>
            </HoverCard>
          </ErrorBoundary>
        )}
      </article>
    );
  },
);
AnimeCard.displayName = "AnimeCard";
