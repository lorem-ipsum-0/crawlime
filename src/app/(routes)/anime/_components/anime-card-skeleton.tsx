import { IconPhotoCircle } from "@tabler/icons-react";
import { Skeleton } from "~/ui/skeleton";

export const AnimeCardSkeleton = () => (
  <article>
    <Skeleton className="mb-2 flex aspect-[6/9] w-full items-center justify-center rounded-md shadow-md">
      <IconPhotoCircle
        strokeWidth="1"
        className="h-10 w-10 text-muted-foreground"
      />
    </Skeleton>
    <Skeleton className="mb-2.5 h-2 max-w-[180px]"></Skeleton>
    <Skeleton className="mb-2.5 h-2 max-w-[140px]"></Skeleton>
  </article>
);
