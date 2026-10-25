import { getCollection } from "astro:content";
import type { WorkItem } from "../data/content";

/** Published learning entries, newest first, mapped for display. */
export async function getWorkItems(): Promise<WorkItem[]> {
  const entries = await getCollection("learning", ({ data }) => !data.draft);
  return entries
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((entry) => ({
      id: entry.id,
      href: `/learning/${entry.id}/`,
      title: entry.data.title,
      shortTitle: entry.data.title.split(":")[0]?.trim() ?? entry.data.title,
      description: entry.data.description,
      type: entry.data.type,
      dateLabel: entry.data.date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      org: entry.data.org,
      image: entry.data.image,
      links: entry.data.links,
      tags: entry.data.tags,
    }));
}
