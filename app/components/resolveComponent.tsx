import type {
  ResolveComponentFunction,
  ResolveComponentResult,
} from "@uniformdev/next-app-router";
import type { ComponentProps } from "@uniformdev/next-app-router/component";

import ArticleDetailComposition from "./ArticleDetailComposition";
import CardGrid from "./CardGrid";
import ContentBlock from "./ContentBlock";
import HeroSection from "./HeroSection";
import ImageWithText from "./ImageWithText";
import LinkCard from "./LinkCard";
import NewsArticle from "./NewsArticle";
import Page from "./Page";
import SkiConditions from "./SkiConditions";
import TrailActivity from "./TrailActivity";
import TrailList from "./TrailList";
import TrailSystem, {
  createTrailSystem,
  loopIndexForTrailSystem,
} from "./TrailSystem";

const componentMap: Record<string, ResolveComponentResult["component"]> = {
  page: Page,
  articleDetailComposition: ArticleDetailComposition,
  heroSection: HeroSection,
  contentBlock: ContentBlock,
  imageWithText: ImageWithText,
  cardGrid: CardGrid,
  linkCard: LinkCard,
  newsArticle: NewsArticle,
  trailList: TrailList,
  trailSystem: TrailSystem,
  trailActivity: TrailActivity,
  skiConditions: SkiConditions,
};

const NotFoundComponent = ({ type }: ComponentProps) => (
  <div>
    Component &quot;{type}&quot; couldn&apos;t be resolved as it is not mapped
    in the resolveComponent function yet.
  </div>
);

export const resolveComponent: ResolveComponentFunction = ({ component }) => {
  // The loop repeats Trail System in list order. The index lets each card
  // hide itself past numberOfTrailSystems. The map entry stays registered.
  if (component.type === "trailSystem") {
    return {
      component: createTrailSystem(loopIndexForTrailSystem(component)),
    };
  }

  return {
    component: componentMap[component.type] ?? NotFoundComponent,
  };
};
