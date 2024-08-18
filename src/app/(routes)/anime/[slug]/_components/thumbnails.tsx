import { IconPlayerPlay } from "@tabler/icons-react";
import { useState } from "react";
import { useKeyPress } from "~/hooks/use-keypress";
import { type AnimeFull } from "~/server/crawler/anime/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/ui/dialog";
import { cn } from "~/ui/utils/cn";

export const Thumbnails = ({
  preview,
  trailer,
}: {
  preview: AnimeFull["preview"];
  trailer: AnimeFull["trailer"];
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const items = [...(trailer.embedId ? [trailer] : []), ...preview];

  useKeyPress({
    ArrowLeft: () =>
      setSelectedIndex((i) =>
        i === 0 ? preview.length - 1 : Math.max(0, i - 1),
      ),
    ArrowRight: () =>
      setSelectedIndex((i) =>
        i === preview.length - 1 ? 0 : Math.min(preview.length - 1, i + 1),
      ),
  });

  return (
    <div className="grid w-full grid-cols-2 items-start gap-4 md:grid-cols-5">
      {items.map((item, i) =>
        "embedId" in item ? (
          <a
            key={item.videoUrl ?? i}
            className="relative col-span-full md:col-span-1"
            href={item.videoUrl ?? ""}
            onClick={(e) => {
              e.preventDefault();
              setSelectedIndex(i);
            }}
          >
            <div className="absolute left-1/2 top-1/2 flex h-10 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-accent/80">
              <IconPlayerPlay className="size-8 text-accent-foreground" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="size-full rounded-lg object-cover"
              src={item.thumbnailUrl ?? ""}
              alt=""
            />
          </a>
        ) : (
          <a
            key={item.imageUrl ?? i}
            href={item.imageUrl ?? ""}
            onClick={(e) => {
              e.preventDefault();
              setSelectedIndex(i);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="size-full rounded-lg object-cover"
              src={item.thumbnailUrl ?? ""}
              alt=""
            />
          </a>
        ),
      )}
      {selectedIndex >= 0 ? (
        <Dialog
          open
          onOpenChange={(open) =>
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            !open ? setSelectedIndex(-1) : null
          }
        >
          <DialogTitle className="sr-only">Попередній перегляд</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
          <DialogContent className={cn("max-w-max p-0")}>
            <DialogClose>
              {"embedId" in items[selectedIndex]! ? (
                <div className="relative w-screen md:w-[80vw]">
                  <div className="h-[56.25vw] max-h-[calc(100vh-15.625rem)] min-h-[25vw]" />
                  <iframe
                    className="absolute left-0 top-0 size-full rounded-lg border-none"
                    src={`//youtube.com/embed/${items[selectedIndex].embedId ?? ""}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Трейлер"
                  />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="max-h-[calc(100vh-15.625rem)] w-full rounded-lg object-contain"
                  src={items[selectedIndex]!.imageUrl ?? ""}
                  alt=""
                />
              )}
            </DialogClose>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};
