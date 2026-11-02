import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type Column<T> = {
  header: string;
  cell: (row: T) => ReactNode;
  /** La colonne qui sert de titre à la carte sur petit écran. */
  primary?: boolean;
  className?: string;
};

type TableProps<T> = {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string;
};

/**
 * Tableau sur grand écran, liste de cartes sur petit écran.
 * Le choix suit la largeur du bloc (container query), pas celle de la fenêtre :
 * le même composant sert donc à la vue bureau et à la vue mobile.
 */
export function Table<T>({ caption, columns, rows, getKey }: TableProps<T>) {
  const primary = columns.find((c) => c.primary) ?? columns[0];
  const others = columns.filter((c) => c !== primary);

  return (
    <div className="@container">
      <table className="hidden w-full text-left text-sm @2xl:table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line text-xs font-semibold tracking-wide text-muted uppercase">
            {columns.map((c) => (
              <th key={c.header} scope="col" className={cx("px-3 py-2.5", c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={getKey(row)} className="hover:bg-brand-50/50">
              {columns.map((c) => (
                <td key={c.header} className={cx("px-3 py-3 align-middle", c.className)}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="flex flex-col gap-3 @2xl:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li key={getKey(row)} className="rounded-xl border border-line bg-card p-3.5">
            <div className="font-semibold">{primary?.cell(row)}</div>
            <dl className="mt-2 flex flex-col gap-1.5 text-sm">
              {others.map((c) => (
                <div key={c.header} className="flex items-center justify-between gap-3">
                  <dt className="text-muted">{c.header}</dt>
                  <dd className="text-right">{c.cell(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
