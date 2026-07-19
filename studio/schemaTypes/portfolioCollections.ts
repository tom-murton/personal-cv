import { defineArrayMember, defineField, defineType } from "sanity";

const projectReference = defineArrayMember({ type: "reference", to: [{ type: "portfolioProject" }] });
const articleReference = defineArrayMember({ type: "reference", to: [{ type: "portfolioArticle" }] });
const talkReference = defineArrayMember({ type: "reference", to: [{ type: "portfolioTalk" }] });
const experienceReference = defineArrayMember({ type: "reference", to: [{ type: "portfolioExperience" }] });

const introductionFields = [
  defineField({ name: "eyebrow", title: "Small heading", type: "string", validation: (rule) => rule.required() }),
  defineField({ name: "title", title: "Heading", type: "string", validation: (rule) => rule.required() }),
  defineField({ name: "description", title: "Introduction", type: "text", rows: 4, validation: (rule) => rule.required() }),
];

export const portfolioCollections = defineType({
  name: "portfolioCollections",
  title: "Collection pages",
  type: "document",
  groups: [
    { name: "projects", title: "Projects", default: true },
    { name: "writing", title: "Writing" },
    { name: "talks", title: "Talks" },
    { name: "cv", title: "CV" },
  ],
  fields: [
    defineField({
      name: "projects",
      title: "Projects page",
      type: "object",
      group: "projects",
      fields: [
        ...introductionFields,
        defineField({ name: "items", title: "Project order", type: "array", of: [projectReference], options: { sortable: true }, validation: (rule) => rule.unique() }),
      ],
    }),
    defineField({
      name: "writing",
      title: "Writing page",
      type: "object",
      group: "writing",
      fields: [
        ...introductionFields,
        defineField({ name: "items", title: "Article order", type: "array", of: [articleReference], options: { sortable: true }, validation: (rule) => rule.unique() }),
      ],
    }),
    defineField({
      name: "talks",
      title: "Talks page",
      type: "object",
      group: "talks",
      fields: [
        ...introductionFields,
        defineField({ name: "items", title: "Talk order", type: "array", of: [talkReference], options: { sortable: true }, validation: (rule) => rule.unique() }),
      ],
    }),
    defineField({
      name: "cv",
      title: "CV page",
      type: "object",
      group: "cv",
      fields: [
        ...introductionFields,
        defineField({ name: "items", title: "Experience order", type: "array", of: [experienceReference], options: { sortable: true }, validation: (rule) => rule.unique() }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Collection pages" }),
  },
});
