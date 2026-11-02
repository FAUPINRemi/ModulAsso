# apps/web

Front public d'Alvéo : une seule application Next.js pour le bureau et le mobile (PWA).

## Lancer

```
cp .env.example .env.local
npm install
npm run dev
```

Ouvre http://localhost:3000 puis choisis **Mode démo**. Aucune API n'est nécessaire pour l'instant.

## Ce qui est de la démo (à remplacer)

| Quoi | Où | Remplacé par |
| --- | --- | --- |
| Session dans un cookie | `src/lib/session.ts`, `features/socle/actions.ts` | Jeton de l'API dans un cookie httpOnly |
| Données d'exemple | `features/*/mock.ts` | Client généré `packages/api-client` dans des server actions |
| Ordre des widgets dans le navigateur | `components/dashboard/WidgetGrid` | Table `vue_dashboard` |

## Vue bureau ou mobile

`src/proxy.ts` choisit la vue (cookie `vue`, sinon appareil). Les pages mobiles sont sous `/m`.
Next 16 appelle `proxy` ce que le document d'architecture nomme `middleware` : même rôle.
