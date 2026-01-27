import fs from "node:fs/promises";
import path from "node:path";

import type { Country, Page, Service } from "@/types/content";

const DATA_ROOT = path.join(process.cwd(), "src/data");

async function loadFolder<T>(
  locale: string,
  section: "countries" | "pages" | "services"
): Promise<T[]> {
  const folderPath = path.join(DATA_ROOT, locale, section);

  const files = await fs.readdir(folderPath);

  const items: T[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const fullPath = path.join(folderPath, file);
    const raw = await fs.readFile(fullPath, "utf-8");

    items.push(JSON.parse(raw) as T);
  }

  return items;
}

export function loadCountries(locale: string) {
  return loadFolder<Country>(locale, "countries");
}

export function loadPages(locale: string) {
  return loadFolder<Page>(locale, "pages");
}

export function loadServices(locale: string) {
  return loadFolder<Service>(locale, "services");
}
