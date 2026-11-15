import { marquee } from "@/lib/content";

/** Slow-moving strip of trust facts between the hero and the page body. Pauses on hover. */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {marquee.map((m) => (
        <li key={m} className="flex items-center whitespace-nowrap px-6 text-[0.95rem] font-medium text-ink sm:px-8 sm:text-[1.02rem]">
          <span aria-hidden className="mr-6 size-1.5 rounded-full bg-green sm:mr-8" />
          {m}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="group relative overflow-hidden border-b border-line bg-paper py-5">
      <div className="flex w-max motion-safe:animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper to-transparent sm:w-32" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent sm:w-32" />
    </div>
  );
}
