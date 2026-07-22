export const portfolioContentQuery = `{
  "settings": *[_id == "portfolio-site-settings"][0]{
    name,
    descriptor,
    hero,
    navigation[]{label, href},
    socialLinks[]{label, href},
    theme
  },
  "homepage": *[_id == "portfolio-homepage"][0]{
    sections[]{
      _key,
      _type,
      internalName,
      enabled,
      eyebrow,
      title,
      body,
      _type == "portfolioProjectSection" => {
        "projectRows": rows[]{
          _key,
          enabled,
          layout,
          "itemDocumentIds": items[]._ref
        }
      },
      _type == "portfolioArticleSection" => {
        "itemDocumentIds": items[]._ref
      },
      _type == "portfolioTalkSection" => {
        "itemDocumentIds": items[]._ref
      }
    }
  },
  "collections": *[_id == "portfolio-collections"][0]{
    projects{eyebrow, title, description, "itemDocumentIds": items[]._ref},
    writing{eyebrow, title, description, "itemDocumentIds": items[]._ref},
    talks{eyebrow, title, description, "itemDocumentIds": items[]._ref},
    cv{eyebrow, title, description, "itemDocumentIds": items[]._ref}
  },
  "projects": *[_type == "portfolioProject" && archived != true]{
    _id,
    title,
    "slug": slug.current,
    status,
    kind,
    year,
    summary,
    currentNote,
    visual{
      kind,
      preset,
      alt,
      "imageUrl": image.asset->url,
      "hotspot": image.hotspot
    },
    link
  },
  "articles": *[_type == "portfolioArticle" && visible != false]{
    _id,
    title,
    "slug": slug.current,
    description,
    dateLabel,
    articleType,
    projectName,
    "projectId": relatedProject->slug.current,
    body,
    links[]{label, href},
    externalUrl
  },
  "talks": *[_type == "portfolioTalk" && visible != false]{
    _id,
    title,
    "slug": slug.current,
    event,
    description,
    dateLabel,
    externalUrl
  },
  "experiences": *[_type == "portfolioExperience"]{
    _id,
    title,
    company,
    companyUrl,
    period,
    description,
    achievements,
    skills
  }
}`;

export const portfolioMutationQuery = `*[
  _type in [
    "portfolioSiteSettings",
    "portfolioHomepage",
    "portfolioCollections",
    "portfolioProject",
    "portfolioArticle",
    "portfolioTalk",
    "portfolioExperience"
  ]
]`;
