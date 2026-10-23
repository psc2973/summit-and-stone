import { Snowflake } from "lucide-react";
import {
  UniformText,
  type ComponentParameter,
  type ComponentProps,
} from "@uniformdev/next-app-router/component";

// Values come from the Open-Meteo data type. Ask it for inches and °F with
// precipitation_unit=inch and temperature_unit=fahrenheit.
const SNOW_UNIT = "in";
const TEMP_UNIT = "°F";

// Every value arrives as text because Uniform dynamic tokens resolve to
// strings. In Canvas, bind:
//   freshSnow -> daily > snowfall_sum > 0
//   highTemp  -> daily > temperature_2m_max > 0
//   lowTemp   -> daily > temperature_2m_min > 0
interface SkiConditionsParameters {
  resortName: ComponentParameter<string>;
  freshSnow: ComponentParameter<string>;
  highTemp: ComponentParameter<string>;
  lowTemp: ComponentParameter<string>;
  note: ComponentParameter<string>;
}

// Returns a rounded number, or null when the value is missing or not a number.
function toNumber(value: string | undefined, decimals = 0) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const factor = 10 ** decimals;
  return Math.round(parsed * factor) / factor;
}

export default function SkiConditions({
  parameters: { resortName, freshSnow, highTemp, lowTemp, note },
  component,
}: ComponentProps<SkiConditionsParameters>) {
  const snow = toNumber(freshSnow?.value, 1);
  const high = toNumber(highTemp?.value);
  const low = toNumber(lowTemp?.value);

  // Keep the note in the page while editing so authors can click into it,
  // but hide it for visitors when it is empty.
  const showNote =
    Boolean(note?.value) || Boolean(note?._contextualEditing?.isEditable);

  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-gradient-to-br from-sky-50 to-white ring-1 ring-black/10">
        <div className="flex items-center gap-2 border-b border-sky-100 px-5 py-3">
          <Snowflake className="h-5 w-5 text-sky-600" aria-hidden="true" />
          <UniformText
            parameter={resortName}
            component={component}
            as="h3"
            className="text-lg font-semibold text-zinc-900"
            placeholder="Resort name here..."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
              Fresh snow today
            </p>
            <p className="mt-1 text-5xl font-bold text-zinc-900">
              {snow === null ? "--" : snow}
              <span className="ml-1 text-2xl font-semibold text-zinc-500">
                {SNOW_UNIT}
              </span>
            </p>
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
              Today&apos;s temperature
            </p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900">
              High {high === null ? "--" : `${high}${TEMP_UNIT}`}
            </p>
            <p className="text-2xl font-semibold text-zinc-500">
              Low {low === null ? "--" : `${low}${TEMP_UNIT}`}
            </p>
          </div>
        </div>

        {showNote ? (
          <div className="border-t border-sky-100 px-5 py-3">
            <UniformText
              parameter={note}
              component={component}
              as="p"
              className="text-sm text-zinc-700"
              placeholder="Optional note, e.g. Powder day! Get here early."
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
