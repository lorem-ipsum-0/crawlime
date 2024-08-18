import { NextResponse } from 'next/server';
import { getAnime } from '~/server/crawler/anime/item';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  return NextResponse.json(await getAnime({ slug: params.slug }));
}
