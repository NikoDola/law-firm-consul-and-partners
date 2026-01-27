import { redirect } from "next/navigation";

export default function AdminPage() {
  // Next serves files from `public/` at their exact path.
  // It does NOT automatically map `/admin` -> `/admin/index.html`.
  redirect("/admin/index.html");
}

