"use client";
import { Navbar } from "../components/layout/Navbar";

export default function HomePage() {
  // const [open, setOpen] = useState(false);
  // const [me, setMe] = useState<{
  //   email: string;
  //   username: string | null;
  // } | null>(null);

  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     try {
  //       const res = await fetch("/api/me", { cache: "no-store" });
  //       if (!res.ok) return;
  //       const json = (await res.json()) as {
  //         ok: boolean;
  //         data?: { email: string; username: string | null };
  //       };
  //       if (mounted && json.ok && json.data) setMe(json.data);
  //     } catch {
  //       // ignore
  //     }
  //   })();
  //   return () => {
  //     mounted = false;
  //   };
  // }, []);

  return <div className="w-full min-h-screen bg-[#140C1F] text-white">
    <Navbar />
  </div>;
}
