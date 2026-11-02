"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { WidgetFrame } from "@/components/dashboard/WidgetFrame";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cx } from "@/lib/cx";
import { moveItem, reconcileOrder } from "./order";

export type Widget = { id: string; title: string; wide?: boolean; content: ReactNode };

type WidgetGridProps = { widgets: Widget[]; storageKey: string };

/**
 * Grille de widgets. Sur PC on les glisse avec la poignée, partout on peut
 * utiliser les flèches (utile sur téléphone et au clavier). L'ordre est gardé
 * dans le navigateur ; la table `vue_dashboard` le gardera plus tard côté serveur.
 */
export function WidgetGrid({ widgets, storageKey }: WidgetGridProps) {
  const ids = useMemo(() => widgets.map((w) => w.id), [widgets]);
  const [stored, setStored] = useLocalStorage<string[]>(storageKey, ids);
  const order = useMemo(() => reconcileOrder(stored, ids), [stored, ids]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const frames = useRef<Record<string, HTMLElement | null>>({});

  const byId = new Map(widgets.map((w) => [w.id, w]));
  const move = (from: number, to: number) => setStored(moveItem(order, from, to));

  return (
    <div className="@container">
      <div className="grid gap-4 @3xl:grid-cols-3">
        {order.map((id, index) => {
          const widget = byId.get(id);
          if (!widget) return null;
          return (
            <div
              key={id}
              className={cx(widget.wide && "@3xl:col-span-2")}
              onDragOver={(e) => {
                if (!dragId) return;
                e.preventDefault();
                setOverId(id);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragId) move(order.indexOf(dragId), index);
                setDragId(null);
                setOverId(null);
              }}
            >
              <WidgetFrame
                ref={(el) => {
                  frames.current[id] = el;
                }}
                title={widget.title}
                dragging={dragId === id}
                dropTarget={overId === id && dragId !== id}
                canUp={index > 0}
                canDown={index < order.length - 1}
                onMove={(dir) => move(index, index + dir)}
                onDragStart={(e) => {
                  setDragId(id);
                  e.dataTransfer.effectAllowed = "move";
                  const frame = frames.current[id];
                  if (frame) e.dataTransfer.setDragImage(frame, 24, 24);
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setOverId(null);
                }}
              >
                {widget.content}
              </WidgetFrame>
            </div>
          );
        })}
      </div>
    </div>
  );
}
