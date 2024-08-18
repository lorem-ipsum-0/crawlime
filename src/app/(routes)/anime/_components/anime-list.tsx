"use client";
import {
  IconFilter,
  IconLoader2,
  IconSearch,
  IconTrashX,
  IconX,
} from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useBreakpoint } from "~/hooks/use-breakpoint";
import { useDebounce } from "~/hooks/use-debounce";
import { useIntersectionEffect } from "~/hooks/use-intersection-effect";
import { type AnimePreview } from "~/server/crawler/anime/types";
import { type PaginatedResponse } from "~/server/pagination";
import { Button } from "~/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/ui/drawer";
import { Form } from "~/ui/form";
import { Input } from "~/ui/input";
import { AnimeCard } from "./anime-card";
import { AnimeCardSkeleton } from "./anime-card-skeleton";
import { Filters } from "./filters";
import { type FilterValues } from "./types";

export const AnimeList = () => {
  const nextRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<FilterValues>({});
  const debouncedFilter = useDebounce(filter);
  const breakpoint = useBreakpoint();

  const form = useForm<FilterValues>({});

  useEffect(() => {
    const { unsubscribe } = form.watch((value) =>
      setFilter(value as FilterValues),
    );
    return () => unsubscribe();
  }, [form]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [`/api/anime`, debouncedFilter],
      queryFn: ({ pageParam, signal }) =>
        axios
          .get<PaginatedResponse<AnimePreview>>(`/api/anime`, {
            params: { page: pageParam, ...debouncedFilter },
            signal,
          })
          .then((res) => res.data),
      initialPageParam: 1,
      getNextPageParam: (prev, _pages, lastPage) =>
        prev.hasMore ? lastPage + 1 : null,
    });

  const animeList = (data?.pages ?? []).reduce<AnimePreview[]>(
    (memo, page) => memo.concat(page.list),
    [],
  );

  useIntersectionEffect(nextRef, () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch(console.error);
    }
  }, [hasNextPage, isFetchingNextPage]);

  return (
    <Form {...form}>
      <form className="flex gap-4">
        <div className="flex-1">
          <div className="mb-6 flex items-center gap-1.5">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 size-5 -translate-y-1/2" />
              <Input
                type="search"
                className="pl-10"
                placeholder="Введіть назву аніме, що вас цікавить..."
                {...form.register("term")}
              />
            </div>
            <Drawer>
              <DrawerContent className="max-h-screen">
                <DrawerHeader>
                  <DrawerTitle>Фільтри</DrawerTitle>
                  <DrawerClose>
                    <IconX
                      aria-label="Закрити"
                      className="absolute right-2 top-2 size-5 text-muted"
                    />
                  </DrawerClose>
                </DrawerHeader>
                <div className="overflow-y-auto p-4">
                  <Filters />
                </div>
              </DrawerContent>
              <DrawerTrigger className="lg:hidden" asChild>
                <Button type="button">
                  <IconFilter />
                </Button>
              </DrawerTrigger>
            </Drawer>
          </div>
          <div className="my-4 grid w-full grid-cols-[repeat(auto-fill,minmax(theme(width[52]),1fr))] gap-x-8 gap-y-4">
            {animeList.map((item, i) => (
              <AnimeCard
                key={item.id}
                ref={i === animeList.length - 1 ? nextRef : undefined}
                item={item}
              />
            ))}
            {isLoading || isFetchingNextPage ? (
              <>
                {[...Array<void>(11)].map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
                <div role="status">
                  <span className="sr-only">Завантаження...</span>
                </div>
              </>
            ) : null}
          </div>
          {animeList.length ? (
            <div className="flex items-center justify-center">
              {hasNextPage ? (
                <Button
                  variant="outline"
                  disabled={isFetchingNextPage}
                  onClick={() => {
                    fetchNextPage().catch(console.error);
                  }}
                >
                  {isFetchingNextPage ? (
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Показати більше аніме
                </Button>
              ) : null}
            </div>
          ) : isLoading ? null : (
            <div className="flex flex-col items-center justify-center gap-4">
              На жаль, нічого не знайдено{" "}
              {Object.keys(filter).length ? (
                <Button type="button" onClick={() => form.reset()}>
                  <IconTrashX /> Скинути фільтри
                </Button>
              ) : null}
            </div>
          )}
        </div>
        {breakpoint === "sm" || breakpoint === "md" ? null : (
          <div className="max-w-80">
            <Filters />
          </div>
        )}
      </form>
    </Form>
  );
};
