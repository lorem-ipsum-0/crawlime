import { IconCircleCaretRight, IconPhotoCircle } from "@tabler/icons-react";
import { Skeleton } from "~/ui/skeleton";

export default function Loading() {
  return (
    <article className="mb-4 flex flex-col gap-y-6">
      <div className="container mb-4">
        <div className="mb-6 flex flex-wrap gap-4">
          <Skeleton className="h-10 min-w-52 flex-1 md:flex-initial" />
          <Skeleton className="h-10 min-w-52 flex-1 md:flex-initial" />
          <Skeleton className="h-10 min-w-52 flex-1 md:flex-initial" />
        </div>
        <div className="relative">
          <div className="h-[56.25vw] max-h-[calc(100vh-15.625rem)] min-h-[25vw]" />
          <Skeleton className="absolute left-0 top-0 flex size-full items-center justify-center rounded-lg">
            <IconCircleCaretRight
              strokeWidth="0.5"
              className="h-40 w-40 text-muted-foreground"
            />
          </Skeleton>
        </div>
      </div>
      <div className="bg-foreground/5">
        <div className="container my-6 flex flex-col justify-start gap-x-4 gap-y-6 md:flex-row">
          <div className="mx-auto aspect-[6/9] basis-64 md:min-w-64">
            <Skeleton className="flex size-full items-center justify-center">
              <IconPhotoCircle
                strokeWidth="1"
                className="h-16 w-16 text-muted-foreground"
              />
            </Skeleton>
          </div>
          <div className="flex flex-1 flex-col gap-y-2 leading-normal">
            <div className="flex gap-1">
              <Skeleton className="my-2 h-6 w-full max-w-sm" />
              <Skeleton className="my-2 ml-auto h-6 w-10" />
            </div>
            <Skeleton className="my-1 h-4 w-full max-w-64" />
            <Skeleton className="my-1 h-4 w-full max-w-56" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-xl" />
              <Skeleton className="h-6 w-28 rounded-xl" />
              <Skeleton className="h-6 w-20 rounded-xl" />
            </div>
            <div className="my-2 flex flex-col gap-2.5">
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-10/12" />
              <Skeleton className="h-3 w-9/12" />
            </div>
            <div className="flex items-start gap-2">
              <Skeleton className="size-3" />
              <Skeleton className="h-4 w-28" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-28 rounded-xl" />
                <Skeleton className="h-5 w-20 rounded-xl" />
                <Skeleton className="h-5 w-32 rounded-xl" />
                <Skeleton className="h-5 w-28 rounded-xl" />
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Skeleton className="size-3" />
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-20 rounded-xl" />
                <Skeleton className="h-5 w-28 rounded-xl" />
                <Skeleton className="h-5 w-32 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Skeleton className="col-span-full aspect-video size-full md:col-span-1" />
          <Skeleton className="aspect-video size-full" />
          <Skeleton className="aspect-video size-full" />
          <Skeleton className="aspect-video size-full" />
          <Skeleton className="aspect-video size-full" />
        </div>
      </div>
      <div className="container">
        <div>
          <Skeleton className="mb-4 h-6 w-36" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-8">
          <Skeleton className="aspect-[6/9] size-full" />
          <Skeleton className="aspect-[6/9] size-full" />
          <Skeleton className="hidden aspect-[6/9] size-full md:block" />
          <Skeleton className="hidden aspect-[6/9] size-full md:block" />
        </div>
      </div>
      <div className="container">
        <div>
          <Skeleton className="mb-4 h-6 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          <Skeleton className="aspect-[6/9] size-full" />
          <Skeleton className="aspect-[6/9] size-full" />
          <Skeleton className="aspect-[6/9] size-full" />
          <Skeleton className="aspect-[6/9] size-full" />
          <Skeleton className="aspect-[6/9] size-full" />
          <Skeleton className="aspect-[6/9] size-full" />
        </div>
      </div>
    </article>
  );
}
