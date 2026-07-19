import { defineField, defineType } from "sanity";

export const portfolioArticleSection = defineType({
  name: "portfolioArticleSection",
  title: "Writing section",
  type: "object",
  fields: [
    defineField({ name: "internalName", title: "Admin label", type: "string", initialValue: "Field notes", validation: (rule) => rule.required() }),
    defineField({ name: "enabled", title: "Show section", type: "boolean", initialValue: true }),
    defineField({ name: "eyebrow", title: "Small heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "items",
      title: "Featured articles",
      type: "array",
      description: "Drag to reorder. The Writing page can contain more entries than the homepage.",
      of: [{ type: "reference", to: [{ type: "portfolioArticle" }] }],
      options: { sortable: true },
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { title: "internalName", enabled: "enabled" },
    prepare: ({ title, enabled }) => ({ title: title ?? "Writing", subtitle: enabled === false ? "Hidden" : "Writing section" }),
  },
});
