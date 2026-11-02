import { daysBetween } from "@/lib/dates";
import type { Article } from "./types";

export const SOON_DAYS = 14;

export const isLow = (a: Article): boolean => a.quantite <= a.seuil;

export const isExpiringSoon = (a: Article, today: string): boolean =>
  a.dlc !== undefined && daysBetween(today, a.dlc) <= SOON_DAYS;
