// src/types/content.ts

/* ----------------------------- */
/* Shared / Utility Types        */
/* ----------------------------- */

export type PracticeArea = {
  headline: string;
  services: string[];
  description1: string;
  description2: string;
};

/* ----------------------------- */
/* Countries                     */
/* ----------------------------- */

export type Country = {
  id: string;
  name: string;
  city: string;
  address: string;
  jurisdiction: string;
  imageUrls: string[];
  addressDescription: string;

  insolvency?: PracticeArea;
  drivingLicence?: PracticeArea;
};

/* ----------------------------- */
/* Pages                         */
/* ----------------------------- */

export type Page = {
  route: string;
  order: number;
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
  isHome: boolean;

  headline1: string;
  description1: string;

  headline2?: string;
  description2?: string;

  headline3?: string;
  description3?: string;

  services?: string[];
  countries?: string[];
};

/* ----------------------------- */
/* Services                      */
/* ----------------------------- */

export type Service = {
  id: string;
  title: string;
  iconKey: string;
  description: string;

  /** references Country.id */
  countries: string[];
};
