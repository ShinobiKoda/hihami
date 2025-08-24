"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type Me = { email: string; username: string | null } | null;

type Ctx = {
  user: Me;
  setUser: (u: Me) => void;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
};

const UserContext = createContext<Ctx | undefined>(undefined);

const STORAGE_KEY = "hihami.me.v1";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Me>(null);

  // Load cached user quickly on mount (if present)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Me;
        setUser(parsed);
      }
    } catch {}
  }, []);

  // Always try to refresh from server on mount
  const clearUser = useCallback(() => {
    setUser(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (!res.ok) {
        clearUser();
        return;
      }
      const json = (await res.json()) as {
        ok: boolean;
        data?: { email: string; username: string | null };
      };
      if (json.ok && json.data) {
        setUser(json.data);
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
        } catch {}
      } else {
        clearUser();
      }
    } catch {
      // Network failure: keep whatever we have
    }
  }, [clearUser]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const value = useMemo<Ctx>(
    () => ({ user, setUser, refreshUser, clearUser }),
    [user, refreshUser, clearUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
