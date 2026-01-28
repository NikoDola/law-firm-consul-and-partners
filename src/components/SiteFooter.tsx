import Link from "next/link";

import { loadCountries, loadPages } from "@/lib/loadContent";

import styles from "./SiteFooter.module.css";

export default async function SiteFooter() {
  const pages = (await loadPages("en")).filter((p) => !p.isHome);
  const countries = await loadCountries("en");

  const insolvencyCountries = countries.filter((c) => Boolean(c.insolvency));
  const drivingCountries = countries.filter((c) => Boolean(c.drivingLicence));

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.brandName}>Consul &amp; Partners</div>
          <div className={styles.brandTagline}>
            Cross-border legal and regulatory consulting.
          </div>
        </div>

        <nav className={styles.columns} aria-label="Footer">
          <div className={styles.col}>
            <div className={styles.colTitle}>Pages</div>
            <ul className={styles.list}>
              {pages
                .sort((a, b) => a.order - b.order)
                .map((p) => (
                  <li key={p.route}>
                    <Link className={styles.link} href={p.route}>
                      {p.headline1}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>Insolvency Administration</div>
            <ul className={styles.list}>
              {insolvencyCountries.map((c) => (
                <li key={c.id}>
                  <Link className={styles.link} href={`/insolvency/${c.id}`}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <div className={styles.colTitle}>EU Driving Licence</div>
            <ul className={styles.list}>
              {drivingCountries.map((c) => (
                <li key={c.id}>
                  <Link
                    className={styles.link}
                    href={`/driving-licence/${c.id}`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <span>© {new Date().getFullYear()} Consul &amp; Partners</span>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

