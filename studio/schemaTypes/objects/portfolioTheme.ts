import { defineField, defineType } from "sanity";

export const portfolioTheme = defineType({
  name: "portfolioTheme",
  title: "Appearance",
  type: "object",
  description: "Controlled theme settings. The layout remains responsive and accessible.",
  fieldsets: [
    { name: "palette", title: "Colour palette", options: { collapsible: true } },
    { name: "character", title: "Layout and character", options: { collapsible: true } },
  ],
  fields: [
    defineField({ name: "background", title: "Background", type: "color", fieldset: "palette", options: { disableAlpha: true } }),
    defineField({ name: "surface", title: "Card surface", type: "color", fieldset: "palette", options: { disableAlpha: true } }),
    defineField({ name: "foreground", title: "Main text", type: "color", fieldset: "palette", options: { disableAlpha: true } }),
    defineField({ name: "muted", title: "Muted text", type: "color", fieldset: "palette", options: { disableAlpha: true } }),
    defineField({ name: "accent", title: "Accent", type: "color", fieldset: "palette", options: { disableAlpha: true } }),
    defineField({ name: "accentInk", title: "Text on accent", type: "color", fieldset: "palette", options: { disableAlpha: true } }),
    defineField({ name: "line", title: "Divider lines", type: "color", fieldset: "palette", options: { disableAlpha: false } }),
    defineField({
      name: "motion",
      title: "Motion intensity",
      type: "string",
      fieldset: "character",
      initialValue: "standard",
      options: {
        layout: "radio",
        list: [
          { title: "Quiet", value: "quiet" },
          { title: "Standard", value: "standard" },
          { title: "Expressive", value: "expressive" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "typeScale",
      title: "Typography scale",
      type: "string",
      fieldset: "character",
      initialValue: "balanced",
      options: {
        layout: "radio",
        list: [
          { title: "Restrained", value: "restrained" },
          { title: "Balanced", value: "balanced" },
          { title: "Editorial", value: "editorial" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "density",
      title: "Page spacing",
      type: "string",
      fieldset: "character",
      initialValue: "balanced",
      options: {
        layout: "radio",
        list: [
          { title: "Compact", value: "compact" },
          { title: "Balanced", value: "balanced" },
          { title: "Airy", value: "airy" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cardHeight",
      title: "Project card height",
      type: "string",
      fieldset: "character",
      initialValue: "balanced",
      options: {
        layout: "radio",
        list: [
          { title: "Compact", value: "compact" },
          { title: "Balanced", value: "balanced" },
          { title: "Cinematic", value: "cinematic" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cornerStyle",
      title: "Corner style",
      type: "string",
      fieldset: "character",
      initialValue: "square",
      options: {
        layout: "radio",
        list: [
          { title: "Square", value: "square" },
          { title: "Soft", value: "soft" },
          { title: "Rounded", value: "rounded" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gridGap",
      title: "Space between project cards",
      type: "string",
      fieldset: "character",
      initialValue: "hairline",
      options: {
        layout: "radio",
        list: [
          { title: "Hairline", value: "hairline" },
          { title: "Balanced", value: "balanced" },
          { title: "Wide", value: "wide" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroBackdrop",
      title: "Homepage backdrop",
      type: "string",
      fieldset: "character",
      initialValue: "rings",
      options: {
        layout: "radio",
        list: [
          { title: "Orbital rings", value: "rings" },
          { title: "Technical grid", value: "grid" },
          { title: "Minimal", value: "minimal" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
