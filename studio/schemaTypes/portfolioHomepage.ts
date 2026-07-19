import { defineField, defineType } from "sanity";

export const portfolioHomepage = defineType({
  name: "portfolioHomepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "sections",
      title: "Homepage sections",
      type: "array",
      description: "Drag sections to reorder the homepage. Each section can also be hidden without deleting it.",
      of: [
        { type: "portfolioProjectSection" },
        { type: "portfolioArticleSection" },
        { type: "portfolioTalkSection" },
        { type: "portfolioAboutSection" },
      ],
      options: { sortable: true },
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
