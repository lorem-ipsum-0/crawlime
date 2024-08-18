"use client";

import { IconBadgeCc, IconBadgeVo } from "@tabler/icons-react";
import { Separator } from "~/ui/separator";

export const AnimeVoiceAndSubs = ({ type }: { type?: string | null }) =>
  type ? (
    <span className="inline-flex items-center gap-x-2">
      {
        {
          "D+S": (
            <>
              <span>
                <IconBadgeVo className="inline-block h-4 w-4 text-foreground" />{" "}
                озвучення
              </span>
              <Separator orientation="vertical" />
              <span>
                <IconBadgeCc className="inline-block h-4 w-4 text-foreground" />{" "}
                субтитри
              </span>
            </>
          ),
          DUB: (
            <span>
              <IconBadgeVo className="inline-block h-4 w-4 text-foreground" />{" "}
              тільки озвучення
            </span>
          ),
          SUB: (
            <span>
              <IconBadgeCc className="inline-block h-4 w-4 text-foreground" />{" "}
              тільки субтитри
            </span>
          ),
        }[type]
      }
    </span>
  ) : null;
AnimeVoiceAndSubs.displayName = "AnimeVoiceAndSubs";
