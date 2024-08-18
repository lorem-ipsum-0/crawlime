import axios from "axios";
import { type CheerioAPI, load } from "cheerio";
import { runInNewContext } from "vm";
import { type PlaylistNode } from "./types";
import { matchGroups } from "./util";
import { env } from "~/env";

const buildAjaxPlaylistTree = (data: Array<Omit<PlaylistNode, "children">>) => {
  const getParentId = (id: string) => id.split("_").slice(0, -1).join("_");

  const tree: PlaylistNode[] = [];

  const byId = data.reduce<Record<string, PlaylistNode>>(
    (memo, item) => ({ ...memo, [item.id]: { ...item, children: [] } }),
    {} satisfies Record<string, PlaylistNode>,
  );

  [...data].forEach((item) => {
    const parentId = getParentId(item.id);
    if (!byId[parentId]) {
      tree.push(byId[item.id]!);
    } else {
      byId[parentId].children.push(byId[item.id]!);
    }
  });

  return tree;
};

const parseAjaxPlaylist = ($: CheerioAPI): PlaylistNode[] => {
  const lists = $(".playlists-player .playlists-lists .playlists-items ul li")
    .map(
      (_, el) =>
        ({
          id: $(el).attr("data-id") ?? "",
          value: $(el).text(),
          label: $(el).text(),
          meta: { type: "list" },
        }) satisfies Omit<PlaylistNode, "children">,
    )
    .get();

  const names = $(".playlists-player .episode-name")
    .map((i, el) => ({
      id: ($(el).attr("data-id") ?? "") + `_${i}`,
      value: $(el).text(),
    }))
    .get()
    .reduce<Record<string, string>>(
      (memo, item) => ({ ...memo, [item.id]: item.value }),
      {},
    );
  const items = $(".playlists-player .playlists-videos .playlists-items ul li")
    .map(
      (i, el) =>
        ({
          id: ($(el).attr("data-id") ?? "") + `_${i}`,
          value: $(el).attr("data-file") ?? "",
          label: $(el).text(),
          meta: {
            type: "video",
            name: names[($(el).attr("data-id") ?? "") + `_${i}`],
          },
        }) satisfies Omit<PlaylistNode, "children">,
    )
    .get();

  return buildAjaxPlaylistTree([...lists, ...items]);
};

const parseRalodePlaylist = ($: CheerioAPI): PlaylistNode[] => {
  const scriptHtml = $("script")
    .filter(':contains("RalodePlayer.init\\([")')
    .text();

  const { scriptJs } =
    scriptHtml.match(/RalodePlayer\.init\((?<scriptJs>\[.+\])\s*,\s*\d+\)/)
      ?.groups ?? {};

  if (!scriptJs) {
    return [];
  }

  const [lists, items] = runInNewContext(`[${scriptJs}]`) as [
    string[],
    Array<Array<{ name: string; code: string; zid: string; sid: string }>>,
  ];

  return lists.map((name, i) => ({
    id: Buffer.from(name).toString("base64"),
    value: name,
    label: name,
    children: (items[i] ?? []).map(({ name, code, zid, sid }) => ({
      id: [zid, sid].join("_"),
      value: code.match(/src="(?<value>[^"]+)"/)?.groups?.value ?? "",
      label: name,
      children: [],
      meta: { type: "video" },
    })),
    meta: { type: "list" },
  }));
};

const getUserHash = ($page: CheerioAPI) =>
  matchGroups<"userHash">(
    $page.text(),
    /var dle_login_hash = '(?<userHash>.+)';/,
  ).userHash;

export interface GetPlaylistParams {
  slug: string;
}

export const getPlaylist = async ({ slug }: GetPlaylistParams) => {
  const id = matchGroups(slug, /(?<id>\d+)-/).id ?? "";

  const html = await axios
    .get<string>(`${env.TARGET_URL}/${slug}.html`)
    .then((res) => res.data);

  const $page = load(html);

  const ralode = parseRalodePlaylist($page);

  const ajax = await axios
    .get<{
      success: boolean;
      response: string | null;
    }>(
      `${env.TARGET_URL}/engine/ajax/playlists.php?news_id=${id}&xfield=playlist&user_hash=${getUserHash($page)}`,
    )
    .then((res) => parseAjaxPlaylist(load(res.data.response ?? "")))
    .catch(() => []);

  return ralode.length ? ralode : ajax;
};
