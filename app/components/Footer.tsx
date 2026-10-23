import Link from "next/link";

import { defaultLocale } from "@/lib/uniform/locale";

const links = [
  { href: "/#topics", label: "Explore" },
  { href: "/#featured-products", label: "Shop" },
  { href: `/${defaultLocale}/news`, label: "News" },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold tracking-tight text-white">
            Summit &amp; Stone
          </p>
          <p className="mt-1 text-sm">Premium outdoor gear for every adventure.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex gap-6 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-zinc-800 px-6 py-4 text-center text-xs text-zinc-400">
        &copy; {new Date().getFullYear()} Summit &amp; Stone. All rights reserved.
      </p>
    </footer>
  );
}
