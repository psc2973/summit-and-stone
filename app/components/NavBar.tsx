import Link from "next/link";
import { getProjectMapClient } from "@uniformdev/next-app-router";
import { Route } from "@uniformdev/project-map";

import { defaultLocale } from "@/lib/uniform/locale";

const homeNodePath = "/:locale";

type NavBarProps = {
  locale?: string;
  matchedRoute?: string;
};

type NavLink = {
  href: string;
  label: string;
  order: number;
};

function expandRoute(path: string, locale: string): string | null {
  const href = new Route(path).expand({ dynamicInputValues: { locale } });
  const hasUnresolvedSegment = href.split("/").some((segment) => segment.startsWith(":"));
  return hasUnresolvedSegment ? null : href;
}

async function getHomeChildLinks(locale: string): Promise<NavLink[]> {
  const client = getProjectMapClient({ cache: { type: "no-cache" } });
  const { nodes } = await client.getNodes({
    path: homeNodePath,
    depth: 1,
    expanded: true,
  });

  return (nodes ?? [])
    .flatMap((node) => {
      if (node.parentPath !== homeNodePath || !node.compositionId) {
        return [];
      }

      const href = expandRoute(node.path, locale);
      if (!href) {
        return [];
      }

      return [
        {
          href,
          label: node.locales?.[locale]?.name || node.name,
          order: node.order ?? 0,
        },
      ];
    })
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}

export default async function NavBar({
  locale = defaultLocale,
  matchedRoute,
}: NavBarProps) {
  const links = await getHomeChildLinks(locale);
  const activeHref = matchedRoute ? expandRoute(matchedRoute, locale) : null;

  return (
    <header className="bg-zinc-900 text-white">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <Link href={`/${locale}`} className="text-lg font-bold tracking-tight">
          Summit &amp; Stone
        </Link>
        <ul className="flex gap-4 sm:gap-6">
          {links.map((link) => {
            const isCurrent = link.href === activeHref;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={
                    isCurrent
                      ? "text-white"
                      : "text-zinc-300 transition-colors hover:text-white"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
