"use client";
import { useMemo } from "react";
import { useLocalStorage } from "~/hooks/use-local-storage";
import { type PlaylistNode } from "~/server/crawler/anime/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";

const defaultSelectedIndexes = (nodes: PlaylistNode[]): number[] => {
  return [
    ...(nodes[0] ? [0] : []),
    ...(nodes[0]?.children.length
      ? defaultSelectedIndexes(nodes[0].children)
      : []),
  ];
};

const getNode = (nodes: PlaylistNode[], indexes?: number[]) =>
  (indexes ?? []).reduce(
    (value: PlaylistNode | undefined, index) =>
      value ? value.children[index] : nodes[index],
    undefined,
  );

export const Playlist = ({
  id,
  nodes,
}: {
  id: string;
  nodes: PlaylistNode[];
}) => {
  const [selected, setSelected] = useLocalStorage(
    `crawlime.anime.${id}.playlist.episode`,
    defaultSelectedIndexes(nodes),
  );

  const episodeUrl = useMemo(() => {
    const node = getNode(nodes, selected);
    return node?.meta.type === "video" ? node.value : undefined;
  }, [nodes, selected]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {(selected ?? []).map((_, i, all) => {
          const options = getNode(nodes, all.slice(0, i))?.children ?? nodes;
          const selectedValue = getNode(nodes, all.slice(0, i + 1))?.value;

          return (
            <Select
              key={i}
              value={selectedValue}
              onValueChange={(nextValue) => {
                setSelected((prev) => {
                  const selectedIndex = options.findIndex(
                    (node) => node.value === nextValue,
                  );
                  return [...(prev ?? [])].map((value, j) =>
                    j < i ? value : j === i ? selectedIndex : 0,
                  );
                });
              }}
            >
              <SelectTrigger className="w-auto min-w-44 flex-1 md:flex-initial">
                <SelectValue placeholder="Виберіть..." />
              </SelectTrigger>
              <SelectPortal>
                <SelectContent>
                  <SelectGroup>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </SelectPortal>
            </Select>
          );
        })}
      </div>
      <div className="relative">
        <div className="h-[56.25vw] max-h-[calc(100vh-15.625rem)] min-h-[25vw]" />
        {episodeUrl ? (
          <iframe
            className="absolute left-0 top-0 size-full border-none"
            src={`${episodeUrl}`}
            allowFullScreen
          />
        ) : null}
      </div>
    </div>
  );
};
