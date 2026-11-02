import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: { default: "Alvéo", template: "%s · Alvéo" },
  description: "Les disponibilités, les échéances, le stock et le matériel de ton association, au même endroit.",
  applicationName: "Alvéo",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1f7a4d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
