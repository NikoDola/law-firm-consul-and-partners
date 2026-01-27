import type { Page, Country } from "@/types/content";

import Link from "next/link";
import { NavPracticeDropdown } from "@/components/NavPracticeDropdown";

import { loadPages, loadCountries } from "@/lib/loadContent";

import "./NavBar.css";

export default async function NavBar() {
  const pages = await loadPages("en");
  const countries = await loadCountries("en");

  return (
    <nav className="navBarDesktop">
      {/* Toggle */}
      <input type="checkbox" id="nav-toggle" className="navToggle" />

      {/* Burger */}
      <label htmlFor="nav-toggle" className="burger">
        <span />
        <span />
        <span />
      </label>

      {/* Menu */}
      <div className="navInner">
        {pages
          .sort((a, b) => a.order - b.order)
          .map((item: Page) => (
            <Link
              className="navLinkDesktop"
              key={item.route}
              href={item.route}
            >
              {item.headline1}
            </Link>
          ))}

        <NavPracticeDropdown
          countries={countries}
          label="Insolvency"
          routeBase="/insolvency"
          field="insolvency"
        />

        <NavPracticeDropdown
          countries={countries}
          label="Driving Licence"
          routeBase="/driving-licence"
          field="drivingLicence"
        />
      </div>
    </nav>
  );
}
