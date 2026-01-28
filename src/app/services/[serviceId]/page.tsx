import { notFound } from "next/navigation";
import type { Metadata } from "next";

import type { Country } from "@/types/content";
import { loadCountries, loadServices } from "@/lib/loadContent";
import HeroMedia from "@/components/HeroMedia";

import styles from "./service.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}): Promise<Metadata> {
  const { serviceId } = await params;
  const services = await loadServices("en");
  const service = services.find((s) => s.id === serviceId);
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;

  const services = await loadServices("en");
  const service = services.find((s) => s.id === serviceId);
  if (!service) notFound();

  const countries = await loadCountries("en");
  const offeredIn = countries.filter((c: Country) => service.countries.includes(c.id));

  return (
    <main>
      <section className={styles.hero}>
        <HeroMedia mediaUrl={null} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.kicker}>Service</div>
          <h1 className={styles.h1}>{service.title}</h1>
          <p className={styles.lede}>{service.description}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.h2}>Available in</h2>
          {offeredIn.length === 0 ? (
            <p className={styles.prose}>No country coverage is listed yet.</p>
          ) : (
            <ul className={styles.list}>
              {offeredIn.map((c) => (
                <li key={c.id} className={styles.listItem}>
                  <span className={styles.countryName}>{c.name}</span>
                  {c.jurisdiction ? (
                    <span className={styles.countryMeta}>{c.jurisdiction}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

