/*
 * One GET to the App Store lookup for every listing the stage names, written to
 * src/content/generated/app-store.json. If the lookup fails or returns nothing, the committed
 * copy is kept, so a build never loses its facts to a network error.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { appStoreIds } from "../../src/content/worlds";

export interface StoreFact {
  id: string;
  name: string;
  version: string;
  versionDate: string;
  firstReleased: string;
  url: string;
}

const file = join(process.cwd(), "src/content/generated/app-store.json");

export async function fetchAppStore(): Promise<Record<string, StoreFact>> {
  const committed = JSON.parse(await readFile(file, "utf8").catch(() => '{"apps":{}}')).apps as Record<string, StoreFact>;
  try {
    const response = await fetch(`https://itunes.apple.com/lookup?id=${appStoreIds.join(",")}&country=gb`, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`App Store lookup returned ${response.status}`);
    const body = await response.json() as { results?: Array<Record<string, string>> };
    const apps: Record<string, StoreFact> = {};
    for (const r of body.results ?? []) {
      apps[String(r.trackId)] = {
        id: String(r.trackId),
        name: r.trackName,
        version: r.version,
        versionDate: r.currentVersionReleaseDate?.slice(0, 10),
        firstReleased: r.releaseDate?.slice(0, 10),
        url: String(r.trackViewUrl).split("?")[0],
      };
    }
    if (!Object.keys(apps).length) throw new Error("App Store lookup returned no listings");
    const merged = { ...committed, ...apps };
    await writeFile(file, `${JSON.stringify({ checked: new Date().toISOString().slice(0, 10), apps: merged }, null, 2)}\n`);
    console.log(`App Store: ${Object.keys(apps).length} listings read.`);
    return merged;
  } catch (error) {
    console.warn(`App Store lookup failed, keeping the committed copy: ${(error as Error).message}`);
    return committed;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await fetchAppStore();
