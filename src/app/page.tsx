import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function RootPage() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      redirect("/Home");
    }
  } catch {
    // If supabase is not configured, fall back to login
  }
  redirect("/login");
}
