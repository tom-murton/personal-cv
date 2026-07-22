import { colorInput } from "@sanity/color-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import { portfolioStructure, singletonSchemaTypes } from "./structure";

const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL ?? "http://127.0.0.1:8080";

export default defineConfig({
  name: "portfolio",
  title: "Tom Murton — Site admin",
  basePath: "/admin",
  projectId: "jbch6ec7",
  dataset: "production",
  plugins: [
    structureTool({ structure: portfolioStructure }),
    presentationTool({
      previewUrl,
      allowOrigins: [
        "http://127.0.0.1:*",
        "http://localhost:*",
        "https://tom-murton-site.vercel.app",
        "https://tommurton.com",
        "https://www.tommurton.com",
      ],
    }),
    visionTool(),
    colorInput(),
  ],
  schema: { types: schemaTypes },
  document: {
    actions: (previous, context) => {
      if (!singletonSchemaTypes.has(context.schemaType)) return previous;
      return previous.filter((action) => action.action && ["publish", "discardChanges", "restore"].includes(action.action));
    },
    newDocumentOptions: (previous, context) => {
      if (context.creationContext.type !== "global") return previous;
      return previous.filter((item) => !singletonSchemaTypes.has(item.templateId));
    },
  },
});
