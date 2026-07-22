import { defineField, defineType } from "sanity";

export const portfolioTalkSection = defineType({
  name: "portfolioTalkSection",
  title: "Talks section",
  type: "object",
  fields: [
    defineField({ name: "internalName", title: "Admin label", type: "string", initialValue: "On stage", validation: (rule) => rule.required() }),
    defineField({ name: "enabled", title: "Show section", type: "boolean", initialValue: true }),
    defineField({ name: "eyebrow", title: "Small heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "items",
      title: "Featured talks",
      type: "array",
      of: [{ type: "reference", to: [{ type: "portfolioTalk" }] }],
      options: { sortable: true },
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: { title: "internalName", enabled: "enabled" },
    prepare: ({ title, enabled }) => ({ title: title ?? "Talks", subtitle: enabled === false ? "Hidden" : "Talks section" }),
  },
});
