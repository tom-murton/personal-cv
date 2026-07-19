import type { ProjectCardSize, ProjectRowLayout } from "@/content/types";

export const projectRowSizes: Record<ProjectRowLayout, ProjectCardSize[]> = {
  single: ["full"],
  "two-equal": ["half", "half"],
  "three-equal": ["third", "third", "third"],
  "feature-left": ["two-thirds", "third"],
  "feature-right": ["third", "two-thirds"],
};

export const projectRowLabels: Record<ProjectRowLayout, string> = {
  single: "One full-width project",
  "two-equal": "Two equal projects",
  "three-equal": "Three equal projects",
  "feature-left": "Large left, small right",
  "feature-right": "Small left, large right",
};
