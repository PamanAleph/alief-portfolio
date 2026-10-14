import type { Entry } from "../../data/content";
import { Reveal } from "../ui/Reveal";

export interface EntryListProps {
  entries: Entry[];
}

/** Education / leadership entries, each revealed with a clip-path wipe. */
export default function EntryList({ entries }: EntryListProps) {
  return (
    <ul className="entries">
      {entries.map((entry, i) => (
        <Reveal key={entry.org} as="li" kind="clip" className="entry" delay={i * 0.06}>
          <p className="entry__dates kicker">{entry.dates}</p>
          <h3 className="entry__org">{entry.org}</h3>
          <p className="entry__detail">{entry.detail}</p>
        </Reveal>
      ))}
    </ul>
  );
}
