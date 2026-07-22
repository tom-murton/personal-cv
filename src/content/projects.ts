import type { Project } from "@/content/types";

export const projects: Project[] = [
  {
    id: "lightscout",
    name: "LightScout",
    status: "Shipped",
    kind: "iOS product",
    year: "2025",
    summary: "AI-assisted location intelligence for photographers planning their next shoot.",
    update: "Live on the App Store and evolving through real-world use.",
    artwork: { type: "preset", preset: "lightscout" },
    href: "https://lightscout.ai",
    hrefLabel: "Visit LightScout",
  },
  {
    id: "warden",
    name: "Warden",
    status: "Building",
    kind: "iOS game",
    year: "2026",
    summary: "A zero-RNG tactics roguelite where every enemy move is visible before it happens.",
    update: "Reworking the core loop around a tense defend-the-wards mechanic.",
    artwork: { type: "preset", preset: "warden" },
  },
  {
    id: "rest-rise",
    name: "Rest + Rise",
    status: "Testing",
    kind: "Wellbeing app",
    year: "2026",
    summary: "Time-bounded morning and evening rituals designed around the first and last hour of the day.",
    update: "Core routines are built; device testing and launch preparation come next.",
    artwork: { type: "preset", preset: "rest-rise" },
  },
  {
    id: "gaming-benchmark",
    name: "Gaming Benchmark",
    status: "Running",
    kind: "Research programme",
    year: "2026",
    summary: "A repeatable test of whether frontier AI models can research, build and ship a real iOS game.",
    update: "The first model run is moving through build, critique and release rounds.",
    artwork: { type: "preset", preset: "gaming-benchmark" },
  },
  {
    id: "marketing-engine",
    name: "Marketing Engine",
    status: "Internal",
    kind: "Maker tool",
    year: "2026",
    summary: "A review-led system for producing and scheduling visual campaigns across several apps.",
    update: "One workflow now handles both LightScout and Rest + Rise campaigns.",
    artwork: { type: "preset", preset: "marketing-engine" },
  },
];

export const projectById = new Map(projects.map((project) => [project.id, project]));
