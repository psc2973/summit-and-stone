import {
  flattenValues,
  type AssetParamValue,
  type RichTextParamValue,
} from "@uniformdev/canvas";
import {
  UniformRichText,
  UniformText,
  type ComponentParameter,
  type ComponentProps,
} from "@uniformdev/next-app-router/component";
import { ArrowLeft, Calendar, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/app/static/_lib/formatDate";
import { defaultLocale } from "@/lib/uniform/locale";

interface NewsArticleParameters {
  // Intro
  title?: ComponentParameter<string>;
  summary?: ComponentParameter<string>;
  category?: ComponentParameter<string>;
  authorName?: ComponentParameter<string>;
  authorRole?: ComponentParameter<string>;
  /** ISO date string, for example "2026-09-14" */
  publishDate?: ComponentParameter<string>;
  /** ISO date string. Shown only when set. */
  updatedDate?: ComponentParameter<string>;
  readTimeMinutes?: ComponentParameter<number>;
  thumbnail?: ComponentParameter<AssetParamValue>;

  // Hero
  image?: ComponentParameter<AssetParamValue>;
  caption?: ComponentParameter<string>;
  credit?: ComponentParameter<string>;

  // Body
  body?: ComponentParameter<RichTextParamValue>;
  /** Comma-separated list, for example "hiking, safety, gear". */
  tags?: ComponentParameter<string>;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/** Dates may arrive as "2026-09-14" or a full ISO timestamp; keep the date part. */
const toIsoDate = (value?: string) => (value ? value.slice(0, 10) : undefined);

const LINK_FOCUS =
  "underline-offset-4 hover:text-zinc-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";

// The rich text arrives as plain HTML elements, so the typography is applied
// from the wrapper. Full class names are listed so Tailwind v4 can detect them.
const RICH_TEXT_CLASSES = [
  "space-y-5 text-lg leading-relaxed text-zinc-700",
  "[&_h2]:pt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-zinc-900",
  "[&_h3]:pt-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-zinc-900",
  "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
  "[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:pl-5 [&_blockquote]:text-xl [&_blockquote]:italic [&_blockquote]:text-zinc-900",
  "[&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-blue-900",
].join(" ");

/**
 * A full news article: hero image, intro (breadcrumb, category, title,
 * summary, byline, thumbnail), rich text body, tags and a link back to the list.
 */
export default function NewsArticle({
  parameters: {
    title,
    summary,
    category,
    authorName,
    authorRole,
    publishDate,
    updatedDate,
    readTimeMinutes,
    thumbnail,
    image,
    caption,
    credit,
    body,
    tags,
  },
  component,
  context,
}: ComponentProps<NewsArticleParameters>) {
  const newsHref = `/${context.dynamicInputs.locale || defaultLocale}/news`;
  const heroAsset = flattenValues(image?.value, { toSingle: true });
  const heroUrl = heroAsset?.url;
  // Alt text comes from the asset library: description first, then title.
  const heroAlt = heroAsset?.description || heroAsset?.title || "";

  const thumbnailUrl = flattenValues(thumbnail?.value, { toSingle: true })?.url;

  const published = toIsoDate(publishDate?.value);
  const updated = toIsoDate(updatedDate?.value);
  const readTime = readTimeMinutes?.value;

  const tagList = (tags?.value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  // Keep optional elements in the DOM while editing so authors can click into
  // them, but hide the empty elements from visitors.
  const isEditable = (parameter?: ComponentParameter<unknown>) =>
    Boolean(parameter?._contextualEditing?.isEditable);
  const showCaption =
    Boolean(caption?.value || credit?.value) || isEditable(caption) || isEditable(credit);
  const showAuthorRole = Boolean(authorRole?.value) || isEditable(authorRole);

  return (
    // max-w-5xl keeps the hero image, intro and body aligned
    <article>
      <figure className="mx-auto max-w-5xl px-6 pt-8">
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl bg-zinc-100">
          {heroUrl && (
            <Image
              src={heroUrl}
              alt={heroAlt}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          )}
        </div>
        {showCaption && (
          <figcaption className="mt-3 text-sm text-zinc-500">
            {caption && (
              <UniformText
                parameter={caption}
                component={component}
                as="span"
                placeholder="Caption text here..."
              />
            )}
            {caption?.value && credit?.value && " "}
            {credit && (
              <UniformText
                parameter={credit}
                component={component}
                as="span"
                className="text-zinc-400"
                placeholder="Credit here..."
              />
            )}
          </figcaption>
        )}
      </figure>

      <header className="mx-auto max-w-5xl px-6 pt-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-500">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className={LINK_FOCUS}>
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-4" />
            </li>
            <li>
              <Link href={newsHref} className={LINK_FOCUS}>
                News
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-4" />
            </li>
            <li
              aria-current="page"
              className="max-w-[16rem] truncate font-medium text-zinc-700 sm:max-w-md"
            >
              {title?.value}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {category && (
              <UniformText
                parameter={category}
                component={component}
                as="span"
                className="mb-4 inline-flex w-fit items-center rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-900"
                placeholder="Category"
              />
            )}
            {title && (
              <UniformText
                parameter={title}
                component={component}
                as="h1"
                className="text-balance text-4xl font-bold text-zinc-900 md:text-5xl"
                placeholder="Title text here..."
              />
            )}
            {summary && (
              <UniformText
                parameter={summary}
                component={component}
                as="p"
                className="mt-4 text-pretty text-xl text-zinc-600"
                placeholder="Summary text here..."
              />
            )}
          </div>
          {/* Decorative: the full image with its description is shown at the top of the page */}
          <div className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:size-36">
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                sizes="144px"
                className="object-cover"
              />
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-zinc-200 py-4 text-sm text-zinc-600">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white"
            >
              {initials(authorName?.value ?? "")}
            </span>
            <p>
              <span className="sr-only">Written by </span>
              {authorName && (
                <UniformText
                  parameter={authorName}
                  component={component}
                  as="span"
                  className="block font-medium text-zinc-900"
                  placeholder="Author name"
                />
              )}
              {authorRole && showAuthorRole && (
                <UniformText
                  parameter={authorRole}
                  component={component}
                  as="span"
                  className="block text-zinc-500"
                  placeholder="Author role"
                />
              )}
            </p>
          </div>
          {published && (
            <p className="flex items-center gap-2">
              <Calendar aria-hidden="true" className="size-4" />
              <span className="sr-only">Published </span>
              <time dateTime={published}>{formatDate(published)}</time>
            </p>
          )}
          {updated && (
            <p className="text-zinc-500">
              Updated <time dateTime={updated}>{formatDate(updated)}</time>
            </p>
          )}
          {readTime !== undefined && readTime !== null && (
            <p className="flex items-center gap-2">
              <Clock aria-hidden="true" className="size-4" />
              {readTime} min read
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {body && (
          <UniformRichText
            parameter={body}
            component={component}
            className={RICH_TEXT_CLASSES}
            placeholder="Article body here..."
          />
        )}

        {tagList.length > 0 && (
          <section aria-labelledby="article-tags" className="mt-12">
            <h2 id="article-tags" className="sr-only">
              Tags
            </h2>
            <ul className="flex flex-wrap gap-2">
              {tagList.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link
          href={newsHref}
          className="mt-10 inline-flex items-center gap-2 font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to all news
        </Link>
      </div>
    </article>
  );
}
