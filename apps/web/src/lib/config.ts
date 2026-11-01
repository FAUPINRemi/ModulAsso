import "server-only";

// Seul endroit qui lit la configuration et les secrets.
// Le reste du code importe `config` et ne touche jamais à process.env.
export const config = {
  apiUrl: process.env.API_URL ?? "http://api:8080",
  demoMode: (process.env.DEMO_MODE ?? "true") === "true",
  isProd: process.env.NODE_ENV === "production",
} as const;
