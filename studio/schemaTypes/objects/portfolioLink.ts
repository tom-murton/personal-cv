import { defineField, defineType } from "sanity";

export const portfolioLink = defineType({
  name: "portfolioLink",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "href",
      title: "URL or site path",
      type: "string",
      description: "Use /projects for an internal page or https://… for an external site.",
      validation: (rule) => rule.required().custom((value) => {
        if (!value || value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://")) return true;
        return "Use a site path beginning with / or a complete http(s) URL.";
      }),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
