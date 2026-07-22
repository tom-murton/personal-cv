import { defineField, defineType } from "sanity";

const rowLayouts = [
  { title: "One full-width project", value: "single", count: 1 },
  { title: "Two equal projects", value: "two-equal", count: 2 },
  { title: "Three equal projects", value: "three-equal", count: 3 },
  { title: "Large left, small right", value: "feature-left", count: 2 },
  { title: "Small left, large right", value: "feature-right", count: 2 },
] as const;

const expectedCount: ReadonlyMap<string, number> = new Map(rowLayouts.map((layout) => [layout.value, layout.count]));
const layoutTitle: ReadonlyMap<string, string> = new Map(rowLayouts.map((layout) => [layout.value, layout.title]));

export const portfolioProjectRow = defineType({
  name: "portfolioProjectRow",
  title: "Project row",
  type: "object",
  fields: [
    defineField({
      name: "internalName",
      title: "Admin label",
      type: "string",
      description: "A private label to help you recognise this row.",
      initialValue: "Project row",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "enabled", title: "Show row", type: "boolean", initialValue: true }),
    defineField({
      name: "layout",
      title: "Row layout",
      type: "string",
      initialValue: "two-equal",
      options: {
        layout: "radio",
        list: rowLayouts.map(({ title, value }) => ({ title, value })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Projects in this row",
      type: "array",
      description: "Drag to swap positions. The selected row layout controls their widths.",
      of: [{ type: "reference", to: [{ type: "portfolioProject" }] }],
      options: { sortable: true },
      validation: (rule) => rule.required().unique().custom((items, context) => {
        const layout = (context.parent as { layout?: string } | undefined)?.layout;
        const count = layout ? expectedCount.get(layout) : undefined;
        if (!count || !Array.isArray(items)) return true;
        return items.length === count
          ? true
          : `${layoutTitle.get(layout)} needs exactly ${count} project${count === 1 ? "" : "s"}.`;
      }),
    }),
  ],
  preview: {
    select: { title: "internalName", layout: "layout", enabled: "enabled" },
    prepare: ({ title, layout, enabled }) => ({
      title: title ?? "Project row",
      subtitle: `${enabled === false ? "Hidden · " : ""}${layoutTitle.get(layout) ?? "Choose a layout"}`,
    }),
  },
});
