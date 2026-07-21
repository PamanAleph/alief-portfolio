import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const learning = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/learning" }),
  schema: z.object({
    type: z.enum(["project", "writing"]),
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    org: z.string().optional(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { learning };
