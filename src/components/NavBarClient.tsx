/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import type { Country, Page } from "@/types/content";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavBarClient({
  pages,
  countries,
}: {
  pages: Page[];
  countries: Country[];
}) {
  const pathname = usePathname() || "/";
  const toggleRef = useRef<HTMLInputElement>(null);

  const [openDropdown, setOpenDropdown] = useState<
    Record<"insolvency" | "driving-licence", boolean>
  >({
    insolvency: false,
    "driving-licence": false,
  });

  const navPages = useMemo(
    () =>
      pages
        .filter((p) => !p.isHome && p.route !== "/")
        .sort((a, b) => a.order - b.order),
    [pages]
  );

  const insolvencyCountries = useMemo(
    () => countries.filter((c) => Boolean(c.insolvency)),
    [countries]
  );

  const drivingCountries = useMemo(
    () => countries.filter((c) => Boolean(c.drivingLicence)),
    [countries]
  );

  const closeMobileMenu = () => {
    if (toggleRef.current) toggleRef.current.checked = false;
  };

  return (
    <nav className="navBarDesktop" aria-label="Primary">
      <div className="container navBarRow">
        <Link className="navLogo" href="/" onClick={closeMobileMenu}>
          <span className="srOnly">Home</span>
          {/* Next serves `/public` at the site root */}
          <img
            className="navLogoImg"
            src="/images/legal-counsel_horizontal-logo.svg"
            alt="Legal Counsel"
          />
        </Link>

        {/* Toggle */}
        <input
          ref={toggleRef}
          type="checkbox"
          id="nav-toggle"
          className="navToggle"
          aria-label="Toggle navigation"
        />

        {/* Burger */}
        <label htmlFor="nav-toggle" className="burger" aria-label="Open menu">
          <span />
          <span />
          <span />
        </label>

        {/* Menu */}
        <div className="navInner">
        <div
          className={`navDropdown ${
            openDropdown.insolvency ? "navDropdownOpen" : ""
          }`}
          onMouseLeave={() =>
            setOpenDropdown((s) => ({ ...s, insolvency: false }))
          }
        >
          <button
            type="button"
            className={`navDropdownTrigger navLinkDesktop ${
              pathname.startsWith("/insolvency") ? "navLinkActive" : ""
            }`}
            aria-expanded={openDropdown.insolvency}
            onClick={() =>
              setOpenDropdown((s) => ({ ...s, insolvency: !s.insolvency }))
            }
          >
            Insolvency Administration
          </button>

          <div className="navDropdownMenu">
            {insolvencyCountries.map((country) => (
              <Link
                key={country.id}
                href={`/insolvency/${country.id}`}
                className={`navDropdownItem ${
                  isActivePath(pathname, `/insolvency/${country.id}`)
                    ? "navDropdownItemActive"
                    : ""
                }`}
                onClick={() => {
                  closeMobileMenu();
                  setOpenDropdown((s) => ({ ...s, insolvency: false }));
                }}
              >
                {country.name}
              </Link>
            ))}
          </div>
        </div>

        <div
          className={`navDropdown ${
            openDropdown["driving-licence"] ? "navDropdownOpen" : ""
          }`}
          onMouseLeave={() =>
            setOpenDropdown((s) => ({ ...s, "driving-licence": false }))
          }
        >
          <button
            type="button"
            className={`navDropdownTrigger navLinkDesktop ${
              pathname.startsWith("/driving-licence") ? "navLinkActive" : ""
            }`}
            aria-expanded={openDropdown["driving-licence"]}
            onClick={() =>
              setOpenDropdown((s) => ({
                ...s,
                "driving-licence": !s["driving-licence"],
              }))
            }
          >
            EU Driving Licence
          </button>

          <div className="navDropdownMenu">
            {drivingCountries.map((country) => (
              <Link
                key={country.id}
                href={`/driving-licence/${country.id}`}
                className={`navDropdownItem ${
                  isActivePath(pathname, `/driving-licence/${country.id}`)
                    ? "navDropdownItemActive"
                    : ""
                }`}
                onClick={() => {
                  closeMobileMenu();
                  setOpenDropdown((s) => ({ ...s, "driving-licence": false }));
                }}
              >
                {country.name}
              </Link>
            ))}
          </div>
        </div>

        {navPages.map((item) => (
          <Link
            className={`navLinkDesktop ${
              isActivePath(pathname, item.route) ? "navLinkActive" : ""
            }`}
            key={item.route}
            href={item.route}
            onClick={closeMobileMenu}
          >
            {item.headline1}
          </Link>
        ))}
        </div>
      </div>
    </nav>
  );
}

