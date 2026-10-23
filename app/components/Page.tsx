import {
  UniformSlot,
  type ComponentProps,
} from "@uniformdev/next-app-router/component";

import Footer from "./Footer";
import NavBar from "./NavBar";

type PageSlots = "content";

export default function Page({
  slots,
  context,
}: ComponentProps<unknown, PageSlots>) {
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
      </main>
      <Footer />
    </div>
  );
}
