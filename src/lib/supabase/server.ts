import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Add it to your .env.local and restart the dev server."
    );
  }
  if (!anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Add it to your .env.local and restart the dev server."
    );
  }

  return createServerClient(url, anon, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options?: CookieOptions) => {
        if (options) {
          cookieStore.set({ name, value, ...options });
        } else {
          cookieStore.set(name, value);
        }
      },
      remove: (name: string, options?: CookieOptions) => {
        if (options) {
          cookieStore.delete({ name, ...options });
        } else {
          cookieStore.delete(name);
        }
      },
    },
  });
}
