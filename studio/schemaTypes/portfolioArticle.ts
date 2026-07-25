import { defineArrayMember, defineField, defineType } from "sanity";

export const portfolioArticle = defineType({
  name: "portfolioArticle",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({
      name: "articleType",
      title: "Article type",
      type: "string",
      initialValue: "project-story",
      options: {
        layout: "radio",
        list: [
          { title: "Hosted project story", value: "project-story" },
          { title: "External article", value: "external" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "projectName", title: "Project name", type: "string", description: "Shown in the article header and details rail." }),
    defineField({ name: "relatedProject", title: "Related portfolio project", type: "reference", to: [{ type: "portfolioProject" }], description: "Optional. Connects the story to the project's live status." }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4, validation: (rule) => rule.required() }),
    defineField({ name: "dateLabel", title: "Published date", type: "string", description: "Shown exactly as entered, for example 23 January 2024.", validation: (rule) => rule.required() }),
    defineField({
      name: "body",
      title: "Article body",
      type: "array",
      hidden: ({ parent }) => parent?.articleType === "external",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Section heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Pull quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bulleted list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                title: "Link",
                type: "object",
                fields: [defineField({ name: "href", title: "URL", type: "url", validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }) })],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({ name: "links", title: "Related links", type: "array", of: [defineArrayMember({ type: "portfolioLink" })], description: "Useful links shown beside the article, such as an App Store page or project website." }),
    defineField({ name: "externalUrl", title: "External article URL", type: "url", hidden: ({ parent }) => parent?.articleType !== "external", validation: (rule) => rule.uri({ scheme: ["http", "https"] }) }),
    defineField({ name: "visible", title: "Visible", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "title", subtitle: "dateLabel" } },
});
