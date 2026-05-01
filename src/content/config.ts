import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date(),
  tags: z.array(z.string()).optional(),
});

const leadership = defineCollection({ type: 'content', schema: postSchema });
const security = defineCollection({ type: 'content', schema: postSchema });
const talks = defineCollection({ type: 'content', schema: postSchema });

export const collections = { leadership, security, talks };
