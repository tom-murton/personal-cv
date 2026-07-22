import { defineField, defineType } from "sanity";

export const portfolioProject = defineType({
  name: "portfolioProject",
  title: "Project",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "visual", title: "Artwork" },
    { name: "link", title: "Link" },
  ],
  fields: [
    defineField({ name: "title", title: "Name", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "content", options: { source: "title", maxLength: 80 }, validation: (rule) => rule.required() }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "content",
      options: {
        list: ["Shipped", "Building", "Testing", "Running", "Internal"],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "kind", title: "Project type", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "year", title: "Year", type: "string", group: "content", validation: (rule) => rule.required().regex(/^\d{4}$/, { name: "year" }) }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, group: "content", validation: (rule) => rule.required().max(240) }),
    defineField({ name: "currentNote", title: "Current note", type: "text", rows: 3, group: "content", validation: (rule) => rule.required().max(240) }),
    defineField({ name: "visual", title: "Artwork", type: "portfolioProjectVisual", group: "visual", validation: (rule) => rule.required() }),
    defineField({ name: "link", title: "Project link", type: "portfolioLink", group: "link" }),
    defineField({ name: "archived", title: "Archive project", type: "boolean", initialValue: false, group: "content" }),
  ],
  preview: {
    select: { title: "title", kind: "kind", status: "status", media: "visual.image" },
    prepare: ({ title, kind, status, media }) => ({ title, subtitle: [status, kind].filter(Boolean).join(" · "), media }),
  },
});
