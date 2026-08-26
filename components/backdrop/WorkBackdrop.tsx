import { CircleOutline, RoundedOutline } from "./primitives";

/**
 * Dark surface — overlapping circles and a cropped diagonal panel bleeding
 * off the edges, distinct from Hero's single-ring composition. Ember ring
 * gives the section its own accent without recoloring every project.
 */
export function WorkBackdrop() {
  return (
    <div className="shape-layer">
      <CircleOutline
        strokeWidth={1}
        className="-left-[18vw] top-[4vw] h-[34vw] w-[34vw] text-shape sm:block"
      />
      <CircleOutline
        strokeWidth={1}
        className="hidden text-ember-24 lg:block lg:left-[2vw] lg:top-[16vw] lg:h-[16vw] lg:w-[16vw]"
      />
      <RoundedOutline
        radius={14}
        strokeWidth={1}
        className="-right-[14vw] bottom-[10vw] hidden h-[30vw] w-[22vw] text-shape-strong md:block md:rotate-6"
      />
      <CircleOutline
        strokeWidth={1}
        className="-right-[10vw] -bottom-[10vw] h-[26vw] w-[26vw] text-shape"
      />
    </div>
  );
}
