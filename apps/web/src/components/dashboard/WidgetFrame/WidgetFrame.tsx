import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import type { DragEvent, ReactNode, Ref } from "react";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { cx } from "@/lib/cx";

type WidgetFrameProps = {
  title: string;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
  dragging?: boolean;
  dropTarget?: boolean;
  canUp: boolean;
  canDown: boolean;
  onMove: (direction: -1 | 1) => void;
  onDragStart: (e: DragEvent<HTMLButtonElement>) => void;
  onDragEnd: () => void;
};

const iconButton =
  "inline-flex size-8 items-center justify-center rounded-lg text-muted hover:bg-brand-50 hover:text-ink disabled:opacity-30";

/** Cadre d'un widget : titre, poignée pour glisser, flèches pour monter ou descendre. */
export function WidgetFrame({ title, children, ref, dragging, dropTarget, canUp, canDown, onMove, onDragStart, onDragEnd }: WidgetFrameProps) {
  return (
    <article
      ref={ref}
      aria-label={title}
      className={cx(
        "flex h-full flex-col gap-3 rounded-card border bg-card p-4 shadow-card transition-opacity",
        dropTarget ? "border-brand-600 ring-2 ring-brand-200" : "border-line",
        dragging && "opacity-40",
      )}
    >
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <div className="flex items-center">
          <button type="button" aria-label={`Monter ${title}`} disabled={!canUp} onClick={() => onMove(-1)} className={iconButton}>
            <ArrowUp className="size-4" aria-hidden />
          </button>
          <button type="button" aria-label={`Descendre ${title}`} disabled={!canDown} onClick={() => onMove(1)} className={iconButton}>
            <ArrowDown className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            draggable
            aria-label={`Glisser ${title}`}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={cx(iconButton, "hidden cursor-grab @3xl:inline-flex")}
          >
            <GripVertical className="size-4" aria-hidden />
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </article>
  );
}
