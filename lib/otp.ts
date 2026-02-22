import crypto from "crypto";

/** Generate a cryptographically secure 6-digit OTP */
export function generateOtp(): string {
  // Random number between 100000–999999
  const otp = crypto.randomInt(100_000, 1_000_000);
  return otp.toString();
}

/** Hash OTP with SHA-256 before storing in DB */
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}
