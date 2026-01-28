import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Country } from "@/types/content";
import { loadCountries, loadPages } from "@/lib/loadContent";
import HeroMedia from "@/components/HeroMedia";

import styles from "./content-page.module.css";

export const dynamic = "force-dynamic";

function routeFromSlug(slug: string[]) {
  return `/${slug.join("/")}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pages = await loadPages("en");
  const route = routeFromSlug(slug);
  const page = pages.find((p) => p.route === route);
  if (!page) return {};

  return {
    title: page.metaTitle || page.headline1,
    description: page.metaDescription || page.description1,
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const route = routeFromSlug(slug);

  const pages = await loadPages("en");
  const page = pages.find((p) => p.route === route);
  if (!page) notFound();

  const countries = await loadCountries("en");
  const relatedCountries = (page.countries ?? [])
    .map((id) => countries.find((c: Country) => c.id === id))
    .filter(Boolean) as Country[];

  return (
    <main>
      <section className={styles.hero}>
        <HeroMedia mediaUrl={page.imageUrl} />

        <div className={`container ${styles.heroInner}`}>
          <h1 className={styles.h1}>{page.headline1}</h1>
          <p className={styles.lede}>{page.description1}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          {page.headline2 ? <h2 className={styles.h2}>{page.headline2}</h2> : null}

          {Array.isArray(page.services) && page.services.length > 0 ? (
            <ul className={styles.bullets}>
              {page.services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : null}

          {page.description2 ? <p className={styles.prose}>{page.description2}</p> : null}

          {page.headline3 ? <h2 className={styles.h2}>{page.headline3}</h2> : null}
          {page.description3 ? <p className={styles.prose}>{page.description3}</p> : null}

          {relatedCountries.length > 0 ? (
            <div className={styles.related}>
              <h3 className={styles.h3}>Related locations</h3>
              <div className={styles.countryGrid}>
                {relatedCountries.map((c) => (
                  <div key={c.id} className={styles.countryCard}>
                    <div className={styles.countryName}>{c.name}</div>
                    {c.city ? (
                      <div className={styles.countryMeta}>
                        {c.city}
                        {c.jurisdiction ? ` · ${c.jurisdiction}` : ""}
                      </div>
                    ) : c.jurisdiction ? (
                      <div className={styles.countryMeta}>{c.jurisdiction}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

