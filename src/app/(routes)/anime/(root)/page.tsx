import { Suspense } from "react";
import { AnimeList } from "../_components/anime-list";

export default function HomePage() {
  return (
    <>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
        Останні надходження
      </h2>
      <Suspense fallback={<>Завантаження...</>}>
        <AnimeList />
      </Suspense>
    </>
  );
}
