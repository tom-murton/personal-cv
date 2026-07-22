import { defineField, defineType } from "sanity";

export const portfolioProjectVisual = defineType({
  name: "portfolioProjectVisual",
  title: "Project artwork",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      title: "Artwork source",
      type: "string",
      initialValue: "image",
      options: {
        layout: "radio",
        list: [
          { title: "Uploaded image", value: "image" },
          { title: "Bespoke preset", value: "preset" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.kind !== "image",
      validation: (rule) => rule.custom((value, context) => {
        const parent = context.parent as { kind?: string } | undefined;
        return parent?.kind !== "image" || value ? true : "Upload an image.";
      }),
    }),
    defineField({
      name: "alt",
      title: "Image description",
      type: "string",
      description: "Describe the image for people using screen readers.",
      hidden: ({ parent }) => parent?.kind !== "image",
      validation: (rule) => rule.custom((value, context) => {
        const parent = context.parent as { kind?: string } | undefined;
        return parent?.kind !== "image" || value ? true : "Add an image description.";
      }),
    }),
    defineField({
      name: "preset",
      title: "Preset",
      type: "string",
      hidden: ({ parent }) => parent?.kind !== "preset",
      options: {
        list: [
          { title: "LightScout", value: "lightscout" },
          { title: "Warden", value: "warden" },
          { title: "Rest + Rise", value: "rest-rise" },
          { title: "Gaming Benchmark", value: "gaming-benchmark" },
          { title: "Marketing Engine", value: "marketing-engine" },
        ],
      },
      validation: (rule) => rule.custom((value, context) => {
        const parent = context.parent as { kind?: string } | undefined;
        return parent?.kind !== "preset" || value ? true : "Choose a preset.";
      }),
    }),
  ],
});
