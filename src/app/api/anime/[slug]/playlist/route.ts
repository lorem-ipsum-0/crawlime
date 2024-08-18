import { NextResponse } from "next/server";
import { getPlaylist } from "~/server/crawler/anime/playlist";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  return NextResponse.json(await getPlaylist({ slug: params.slug }));
}
