import { cache } from "react";

import {
  UniformSlot,
  UniformText,
  type ComponentParameter,
  type ComponentProps,
} from "@uniformdev/next-app-router/component";

// Used when Number of Trail Systems is empty, not a whole number, or less than 1.
const DEFAULT_TRAIL_SYSTEM_COUNT = 6;

// This component has no data logic. In Uniform, an outer Loop repeats it once
// per trail system and binds `name` to the loop item's /properties/name.
// An inner Loop in the `activities` slot repeats Trail Activity once per
// entry in /properties/activities. numberOfTrailSystems limits how many of
// those repeated cards are shown.
interface TrailSystemParameters {
  name: ComponentParameter<string>;
  numberOfTrailSystems?: ComponentParameter<number>;
}

type TrailSystemSlots = "activities";

type TrailSystemProps = ComponentProps<TrailSystemParameters, TrailSystemSlots> & {
  loopIndex?: number;
};

const trailSystemIndexes = cache(() => ({
  next: 0,
  byComponent: new WeakMap<object, number>(),
}));

/**
 * Position of this trail system in the expanded loop. Assigned while
 * components are resolved, which walks the list in display order.
 */
export function loopIndexForTrailSystem(component: object) {
  const state = trailSystemIndexes();
  const existing = state.byComponent.get(component);
  if (existing !== undefined) return existing;

  const index = state.next;
  state.next += 1;
  state.byComponent.set(component, index);
  return index;
}

function trailSystemCount(value: unknown) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;

  if (!Number.isInteger(parsed) || parsed < 1) {
    return DEFAULT_TRAIL_SYSTEM_COUNT;
  }

  return parsed;
}

export function createTrailSystem(loopIndex: number) {
  return function TrailSystemAtIndex(props: ComponentProps<TrailSystemParameters, TrailSystemSlots>) {
    return <TrailSystem {...props} loopIndex={loopIndex} />;
  };
}

export default function TrailSystem({
  parameters: { name, numberOfTrailSystems },
  component,
  slots,
  loopIndex = 0,
}: TrailSystemProps) {
  if (loopIndex >= trailSystemCount(numberOfTrailSystems?.value)) {
    return null;
  }

  return (
    <article className="px-6 py-3">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-5 ring-1 ring-black/10">
        <UniformText
          parameter={name}
          component={component}
          as="h3"
          className="text-lg font-semibold text-zinc-900"
          placeholder="Trail system name here..."
        />
        {/* Trail Activity renders its own <li>, so the slot sits inside the list */}
        <ul className="mt-3 divide-y divide-zinc-100">
          <UniformSlot slot={slots.activities} />
        </ul>
      </div>
    </article>
  );
}
