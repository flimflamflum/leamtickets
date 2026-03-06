export type DayTheme = "neon" | "smack" | null;

export function getDayTheme(date: Date = new Date()): DayTheme {
  const day = date.getDay();
  if (day === 5) return "neon";   // Friday
  if (day === 2) return "smack";  // Tuesday
  return null;
}

export function getDayThemeClass(date: Date = new Date()): string {
  const theme = getDayTheme(date);
  if (theme === "neon") return "day-neon";
  if (theme === "smack") return "day-smack";
  return "";
}
