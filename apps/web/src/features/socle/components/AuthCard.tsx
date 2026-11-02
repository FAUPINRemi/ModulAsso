import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export function AuthCard({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <Card className="flex flex-col gap-5 p-6 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {text && <p className="mt-1.5 text-sm text-muted">{text}</p>}
      </div>
      {children}
    </Card>
  );
}
