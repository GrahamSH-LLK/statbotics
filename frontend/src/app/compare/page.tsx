import type { Metadata } from "next";

import { getCachedAllTeams } from "../../api/server-cache";
import { getYearTeamYears } from "../../api/teams";
import { CURR_YEAR } from "../../constants";
import Tabs from "../../pagesContent/compare/tabs";

export const metadata: Metadata = {
  title: "Compare Teams - Statbotics",
};

export const revalidate = 60;

export default async function ComparePage() {
  const [teams, teamYearsData] = await Promise.all([
    getCachedAllTeams(),
    getYearTeamYears(CURR_YEAR),
  ]);

  return <Tabs teams={teams} teamYears={teamYearsData?.team_years ?? []} />;
}
