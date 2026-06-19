import { CURR_YEAR } from "../constants";

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export function searchValue(searchParams: SearchParams | undefined, key: string) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export function searchYear(searchParams: SearchParams | undefined) {
  const parsed = Number(searchValue(searchParams, "year"));
  return Number.isFinite(parsed) ? parsed : CURR_YEAR;
}

export function clampedTeamYear(value: string | number | undefined) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed === -1) {
    return CURR_YEAR;
  }
  return Math.min(Math.max(parsed, 2002), CURR_YEAR);
}
