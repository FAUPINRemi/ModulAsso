/** Un seul gros chiffre pour le dirigeant. Les bénévoles ne le voient pas (trop de pression). */
export function PresenceStat({ percent }: { percent: number }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-brand-600 p-5 text-white">
      <p className="text-xs font-semibold text-white/80">Présences ce mois-ci</p>
      <p className="text-5xl font-bold tracking-tight">{percent} %</p>
      <p className="text-xs text-white/80">Toute l'équipe confondue. Visible par les dirigeants seulement.</p>
    </div>
  );
}
