export function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-red-400" };
  if (score === 3) return { score, label: "Fair", color: "bg-secondary-400" };
  if (score === 4) return { score, label: "Good", color: "bg-primary-400" };
  return { score, label: "Strong", color: "bg-primary-600" };
}
