import { defineField, defineType } from "sanity";

export const portfolioTalk = defineType({
  name: "portfolioTalk",
  title: "Talk",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "event", title: "Event", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: "dateLabel", title: "Date", type: "string", description: "Shown exactly as entered, for example June 2025.", validation: (rule) => rule.required() }),
    defineField({ name: "externalUrl", title: "Event URL", type: "url", validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }) }),
    defineField({ name: "visible", title: "Visible", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "title", event: "event", dateLabel: "dateLabel" },
    prepare: ({ title, event, dateLabel }) => ({ title, subtitle: [event, dateLabel].filter(Boolean).join(" · ") }),
  },
});
