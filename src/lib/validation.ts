import { z } from "zod";

export const verifyOtpSchema = z.object({
  uid: z.string().min(1, "Missing uid"),
  otp: z.string().regex(/^\d{4}$/i, "OTP must be 4 digits"),
});

export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;
