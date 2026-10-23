import {
  UniformSlot,
  type ComponentProps,
} from "@uniformdev/next-app-router/component";

import Footer from "./Footer";
import NavBar from "./NavBar";

type ArticleDetailCompositionSlots =
  | "header"
  | "content"
  | "relatedArticles"
  | "footer";

/**
 * Page shell for a single article: site navigation, an optional header area,
 * the article content, related articles and the footer.
 */
export default function ArticleDetailComposition({
  slots,
  context,
}: ComponentProps<unknown, ArticleDetailCompositionSlots>) {
  const hasRelatedArticles = (slots.relatedArticles?.items?.length ?? 0) > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-zinc-900"
      >
        Skip to content
      </a>
      <NavBar
        locale={context.dynamicInputs.locale}
        matchedRoute={context.matchedRoute}
      />
      <main id="main" className="flex-1">
        <UniformSlot slot={slots.content} />
        {/* The slot stays rendered when empty so authors can drop components into it */}
        <section
          aria-labelledby={hasRelatedArticles ? "related-articles" : undefined}
          className="mx-auto max-w-5xl px-6 pb-16"
        >
          {hasRelatedArticles && (
            <h2
              id="related-articles"
              className="mb-6 text-2xl font-bold text-zinc-900"
            >
              Related articles
            </h2>
          )}
          <UniformSlot slot={slots.relatedArticles} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
