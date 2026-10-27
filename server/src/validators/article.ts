import { z } from "zod";
import { choice, file, flag, objectId, optional, paginationQuery, slug, sortChoice, text } from "./common";

const fields = {
  title: text("Title", { min: 3, max: 160 }),
  description: text("Description", { min: 10, max: 500 }),
  body: text("Content", { max: 100_000 }),
  shortName: slug("Article link"),
  categoryID: objectId("Category"),
};

export const createArticleSchema = z.object({ ...fields, cover: file("Cover image") });

export const draftArticleSchema = z.object({ ...fields, cover: optional(file("Cover image")) });

export const updateArticleSchema = z.object({
  title: optional(fields.title),
  description: optional(fields.description),
  body: optional(fields.body),
  shortName: optional(fields.shortName),
  categoryID: optional(fields.categoryID),
  publish: optional(flag("Publish")),
  cover: optional(file("Cover image")),
});

export const ARTICLE_SORTS = ["newest", "oldest", "title"] as const;

export const articleListQuery = paginationQuery.extend({
  search: optional(text("Search", { max: 80 })),
  category: optional(text("Category", { max: 80 })),
  status: optional(choice("Status", ["published", "draft", "all"] as const)).default("published"),
  sort: sortChoice(ARTICLE_SORTS),
});

export const articleParams = z.object({ shortName: text("Article link", { max: 80 }) });

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type DraftArticleInput = z.infer<typeof draftArticleSchema>;
export type ArticleListQuery = z.infer<typeof articleListQuery>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
