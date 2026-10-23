import {
  flattenValues,
  type AssetParamValue,
  type LinkParamValue,
  type RichTextParamValue,
} from "@uniformdev/canvas";

import {
  UniformRichText,
  UniformText,
  type ComponentParameter,
  type ComponentProps,
} from "@uniformdev/next-app-router/component";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface ImageWithTextParameters {
  heading?: ComponentParameter<string>;
  subheading?: ComponentParameter<string>;
  image?: ComponentParameter<AssetParamValue>;
  imagePosition?: ComponentParameter<"left" | "right">;
  content?: ComponentParameter<RichTextParamValue>;
  link?: ComponentParameter<LinkParamValue>;
  linkText?: ComponentParameter<string>;
}

export default function ImageWithText({
  parameters: { heading, subheading, image, imagePosition, content, link, linkText },
  component,
}: ComponentProps<ImageWithTextParameters>) {
  const asset = flattenValues(image?.value, { toSingle: true });
  const imageUrl = asset?.url;
  // Alt text comes from the asset library: description first, then title.
  const imageAlt = asset?.description || asset?.title || "";
  const isImageRight = imagePosition?.value === "right";

  const href = link?.value?.path;
  // Keep the optional elements in the DOM while editing so authors can click into
  // them, but hide the empty elements from visitors.
  const showSubheading =
    Boolean(subheading?.value) || Boolean(subheading?._contextualEditing?.isEditable);
  const showLink =
    Boolean(href) ||
    Boolean(link?._contextualEditing?.isEditable) ||
    Boolean(linkText?._contextualEditing?.isEditable);

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-xl bg-white ring-1 ring-black/10">
        <div
          className={cn(
            "flex flex-col",
            isImageRight ? "md:flex-row-reverse" : "md:flex-row",
          )}
        >
          <div className="relative aspect-[4/3] w-full bg-zinc-100 md:aspect-auto md:min-h-[420px] md:w-1/2">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
          <div className="flex w-full flex-col justify-center gap-4 p-8 md:w-1/2 md:p-12">
            {heading && (
              <UniformText
                parameter={heading}
                component={component}
                as="h2"
                className="text-balance text-3xl font-bold text-zinc-900 md:text-4xl"
                placeholder="Heading text here..."
              />
            )}
            {subheading && showSubheading && (
              <UniformText
                parameter={subheading}
                component={component}
                as="p"
                className="text-pretty text-lg text-zinc-600"
                placeholder="Subheading text here..."
              />
            )}
            {content && (
              <UniformRichText
                parameter={content}
                component={component}
                className="space-y-4 text-zinc-700"
                placeholder="Content text here..."
              />
            )}
            {showLink && (
              <Link
                href={href ?? "#"}
                className="mt-2 inline-block w-fit font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {linkText && (
                  <UniformText
                    parameter={linkText}
                    component={component}
                    as="span"
                    placeholder="Link text here..."
                  />
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
