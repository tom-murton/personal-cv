export interface HeroContent {
  id?: string;
  greeting: string;
  name: string;
  tagline: string;
  description: string;
}

export interface FeaturedCard {
  id: string;
  number: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
  imageSrc: string;
  order?: number;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  companyLink?: string;
  period: string;
  description: string;
  achievements?: string[];
  skills?: string[];
  startDate?: string;
}

export interface Article {
  id: string;
  title: string;
  date: string;
  description?: string;
  link?: string;
  image?: string;
}

export interface Talk {
  id: string;
  title: string;
  event: string;
  date: string;
  description?: string;
  link?: string;
}

export interface AboutContent {
  id?: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  highlights?: string[];
  currentCompany?: string;
  currentCompanyUrl?: string;
}
