import type { StructureResolver } from "sanity/structure";
import { AdminHome } from "./components/AdminHome";

export const singletonSchemaTypes = new Set([
  "portfolioSiteSettings",
  "portfolioHomepage",
  "portfolioCollections",
]);

export const portfolioStructure: StructureResolver = (S) =>
  S.list()
    .title("Site content")
    .items([
      S.listItem()
        .title("Start here")
        .id("portfolioStart")
        .child(S.component(AdminHome).id("portfolioAdminHome").title("Start here")),
      S.divider(),
      S.listItem()
        .title("Homepage")
        .id("portfolioHomepage")
        .child(S.document().schemaType("portfolioHomepage").documentId("portfolio-homepage")),
      S.listItem()
        .title("Site settings & appearance")
        .id("portfolioSiteSettings")
        .child(S.document().schemaType("portfolioSiteSettings").documentId("portfolio-site-settings")),
      S.listItem()
        .title("Collection pages")
        .id("portfolioCollections")
        .child(S.document().schemaType("portfolioCollections").documentId("portfolio-collections")),
      S.divider(),
      S.documentTypeListItem("portfolioProject").title("Projects"),
      S.documentTypeListItem("portfolioArticle").title("Writing"),
      S.documentTypeListItem("portfolioTalk").title("Talks"),
      S.documentTypeListItem("portfolioExperience").title("CV experience"),
    ]);
