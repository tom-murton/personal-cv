import { defineField, defineType } from "sanity";

export const portfolioProjectPlacement = defineType({
  name: "portfolioProjectPlacement",
  title: "Featured project",
  type: "object",
  fields: [
    defineField({
      name: "project",
      title: "Project",
      type: "reference",
      to: [{ type: "portfolioProject" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "size",
      title: "Desktop card width",
      type: "string",
      initialValue: "half",
      options: {
        layout: "radio",
        list: [
          { title: "Full width", value: "full" },
          { title: "Two thirds", value: "two-thirds" },
          { title: "Half width", value: "half" },
          { title: "One third", value: "third" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "enabled", title: "Show on homepage", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "project.title", subtitle: "size", media: "project.visual.image" },
    prepare: ({ title, subtitle, media }) => ({ title: title ?? "Choose a project", subtitle: subtitle ? `${subtitle} width` : "", media }),
  },
});
