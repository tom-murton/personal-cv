import { defineField, defineType } from "sanity";

export const portfolioSiteSettings = defineType({
  name: "portfolioSiteSettings",
  title: "Site settings & appearance",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "hero", title: "Hero" },
    { name: "navigation", title: "Navigation" },
    { name: "appearance", title: "Appearance" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", type: "string", group: "identity", validation: (rule) => rule.required() }),
    defineField({ name: "descriptor", title: "Short descriptor", type: "string", group: "identity", validation: (rule) => rule.required() }),
    defineField({
      name: "hero",
      title: "Homepage hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "eyebrow", title: "Small heading", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "title", title: "Main line", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "accentTitle", title: "Accent line", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "introduction", title: "Introduction", type: "text", rows: 3, validation: (rule) => rule.required() }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "navigation",
      title: "Primary navigation",
      type: "array",
      group: "navigation",
      description: "Drag to reorder the site navigation.",
      of: [{ type: "portfolioLink" }],
      options: { sortable: true },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "navigation",
      of: [{ type: "portfolioLink" }],
      options: { sortable: true },
    }),
    defineField({ name: "theme", title: "Theme", type: "portfolioTheme", group: "appearance", validation: (rule) => rule.required() }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings & appearance" }),
  },
});
