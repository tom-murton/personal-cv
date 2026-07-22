import { defineField, defineType } from "sanity";

export const portfolioProjectSection = defineType({
  name: "portfolioProjectSection",
  title: "Projects section",
  type: "object",
  fields: [
    defineField({ name: "internalName", title: "Admin label", type: "string", initialValue: "Selected work", validation: (rule) => rule.required() }),
    defineField({ name: "enabled", title: "Show section", type: "boolean", initialValue: true }),
    defineField({ name: "eyebrow", title: "Small heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "rows",
      title: "Project rows",
      type: "array",
      description: "Drag rows to reorder them. Each row controls its own column layout and projects.",
      of: [{ type: "portfolioProjectRow" }],
      options: { sortable: true },
      validation: (rule) => rule.min(1).unique(),
    }),
  ],
  preview: {
    select: { title: "internalName", enabled: "enabled" },
    prepare: ({ title, enabled }) => ({ title: title ?? "Projects", subtitle: enabled === false ? "Hidden" : "Projects section" }),
  },
});
