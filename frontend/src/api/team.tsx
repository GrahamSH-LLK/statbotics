import { CURR_YEAR } from "../constants";
import { APITeam } from "../types/api";
import { TeamYearData, TeamYearRedirect } from "../types/data";
import query, { version } from "./storage";

export async function getTeam(team: number): Promise<{ team: APITeam; team_years: any[] }> {
  const urlSuffix = `/team/${team}`;
  const storageKey = `team_${team}_${version}`;

  return query(storageKey, urlSuffix, false, 0, 60, {
    tags: [`team:${team}`],
  }); // 1 minute
}

export async function getTeamYear(
  team: number,
  year: number
): Promise<TeamYearData | TeamYearRedirect | undefined> {
  const urlSuffix = `/team/${team}/${year}`;
  const storageKey = `team_${team}_${year}_${version}`;

  return query(storageKey, urlSuffix, false, 0, year === CURR_YEAR ? 60 : 60 * 60, {
    tags: [`team:${team}`, `team-year:${team}:${year}`],
  }); // 1 minute / 1 hour
}

export async function getTeamYears(team: number): Promise<any[]> {
  const urlSuffix = `/team/${team}/years`;
  const storageKey = `team_${team}_years_${version}`;

  return query(storageKey, urlSuffix, false, 0, 60, {
    tags: [`team:${team}`],
  }); // 1 minute
}
