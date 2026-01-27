import type { Page, Service } from "@/types/content";

import { loadPages, loadServices } from "@/lib/loadContent";

export default async function Home() {
  const pages = await loadPages("en");
  const services = await loadServices("en");

  const homePage = pages.find((p) => p.isHome);

  if (!homePage) return null;

  return (
    <main>
      <h1>{homePage.headline1}</h1>

      <p style={{ whiteSpace: "pre-line" }}>
        {homePage.description1}
      </p>

      {services.map((item: Service) => (
        <p key={item.id}>{item.id}</p>
      ))}
    </main>
  );
}
