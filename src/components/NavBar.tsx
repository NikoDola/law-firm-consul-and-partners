import pages from "@/data/en/pages.json";
import countries from "@/data/en/countries.json";

import type { Page, Country } from "@/types/content";

import Link from "next/link";
import { NavPracticeDropdown } from "@/components/NavPracticeDropdown";

import "./NavBar.css";

export default function NavBar() {
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
        {pages.map((item: Page) => (
          <Link
            className="navLinkDesktop"
            key={item.route}
            href={item.route}
          >
            {item.headline1}
          </Link>
        ))}

        <NavPracticeDropdown
          countries={countries as Country[]}
          label="Insolvency"
          routeBase="/insolvency"
          field="insolvency"
        />

        <NavPracticeDropdown
          countries={countries as Country[]}
          label="Driving Licence"
          routeBase="/driving-licence"
          field="drivingLicence"
        />
      </div>
    </nav>
  );
}
