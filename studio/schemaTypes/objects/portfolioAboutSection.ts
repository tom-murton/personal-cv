import { defineField, defineType } from "sanity";

export const portfolioAboutSection = defineType({
  name: "portfolioAboutSection",
  title: "About section",
  type: "object",
  fields: [
    defineField({ name: "internalName", title: "Admin label", type: "string", initialValue: "About", validation: (rule) => rule.required() }),
    defineField({ name: "enabled", title: "Show section", type: "boolean", initialValue: true }),
    defineField({ name: "eyebrow", title: "Small heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 5, validation: (rule) => rule.required() }),
  ],
  preview: {
    select: { title: "internalName", enabled: "enabled" },
    prepare: ({ title, enabled }) => ({ title: title ?? "About", subtitle: enabled === false ? "Hidden" : "About section" }),
  },
});
