"use client";

import { IconRefresh } from "@tabler/icons-react";
import { useEffect } from "react";
import { Button } from "~/ui/button";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <article className="flex flex-col items-center gap-6">
      <h2 className="text-lg font-semibold leading-none tracking-tight">
        Халепа, щось зламалося!
      </h2>
      <Button type="button" onClick={() => window.location.reload()}>
        <IconRefresh className="mr-2 size-4" />
        Оновити
      </Button>
    </article>
  );
}
