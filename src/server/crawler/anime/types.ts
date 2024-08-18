export interface AnimePreview {
  id: string;
  slug: string;
  url: string;
  imageUrl: string | null;
  title: string;
  description: string;
  rating: number | null;
  lastUpdateDate: string | null;
  updateReason: string;
  audioType: string;
  age: string | null;
  years: number[];
  currentEpisode: number | null;
  totalEpisodes: number | null;
  duration: number | null;
  specials: string[];
  categories: { name: string }[];
  subAuthors: { name: string }[];
  voiceActors: { name: string }[];
}

export interface AnimeFull {
  id: string;
  slug: string;
  url: string;
  imageUrl: string | null;
  title: string;
  description: string;
  rating: number | null;
  lastUpdateDate: string | null;
  age: string | null;
  years: number[];
  currentEpisode: number | null;
  totalEpisodes: number | null;
  duration: number | null;
  specials: string[];
  categories: { name: string }[];
  subAuthors: { name: string }[];
  voiceActors: { group?: string; name: string }[];
  preview: {
    imageUrl: string | null;
    thumbnailUrl: string | null;
  }[];
  trailer: {
    embedId: string | null;
    videoUrl: string | null;
    thumbnailUrl: string | null;
  };
  related: {
    id: string;
    slug: string;
    url: string | null;
    imageUrl: string | null;
    title: string;
    description: string;
    audioType: string | null;
    years: number[];
    currentEpisode: number | null;
    totalEpisodes: number | null;
    duration: number | null;
  }[];
  similar: {
    id: string;
    slug: string;
    url: string | null;
    imageUrl: string | null;
    title: string;
  }[];
}

export interface PlaylistNode {
  id: string;
  value: string;
  label: string;
  children: PlaylistNode[];
  meta: { type: "list" } | { type: "video"; name?: string };
}

export interface Playlist {
  type: "ralode" | "ajax";
  nodes: PlaylistNode[];
}
