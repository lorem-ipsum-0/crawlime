import { getAnime } from "~/server/crawler/anime/item";
import { AnimeDetails } from "./_components/anime-details";
import { getPlaylist } from "~/server/crawler/anime/playlist";

export default async function Anime({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const item = await getAnime({ slug });
  const playlist = await getPlaylist({ slug });

  return <AnimeDetails item={item} playlist={playlist} />;
}
