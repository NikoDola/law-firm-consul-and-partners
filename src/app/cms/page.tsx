import { redirect } from "next/navigation";

export default function CmsPage() {
  // Keep legacy `/cms` path but send users to the standard Decap panel.
  redirect("/admin/");
}

