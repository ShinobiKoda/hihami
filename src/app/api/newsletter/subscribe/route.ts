import { NextRequest, NextResponse } from "next/server";
import { sendNewsletterWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    await sendNewsletterWelcomeEmail(email);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/newsletter/subscribe error", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
