import { defineField, defineType } from "sanity";

export const portfolioExperience = defineType({
  name: "portfolioExperience",
  title: "CV experience",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Role", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "company", title: "Company", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "companyUrl", title: "Company URL", type: "url", validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }) }),
    defineField({ name: "period", title: "Period", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 5, validation: (rule) => rule.required() }),
    defineField({ name: "achievements", title: "Achievements", type: "array", of: [{ type: "string" }], options: { sortable: true } }),
    defineField({ name: "skills", title: "Skills", type: "array", of: [{ type: "string" }], options: { layout: "tags", sortable: true } }),
  ],
  preview: {
    select: { title: "title", company: "company", period: "period" },
    prepare: ({ title, company, period }) => ({ title, subtitle: [company, period].filter(Boolean).join(" · ") }),
  },
});
