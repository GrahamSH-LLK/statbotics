import type { Metadata } from "next";

import { getYearTeamYears } from "../../api/teams";
import { CURR_YEAR } from "../../constants";
import { type SearchParams, searchValue, searchYear } from "../route-utils";
import TeamsClient from "./client";

export const metadata: Metadata = {
  title: "Teams - Statbotics",
};

export const revalidate = 60;
const TEAMS_ISR_LIMIT = 100;

export default async function TeamsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const year = searchYear(params);
  const data = await getYearTeamYears(year, TEAMS_ISR_LIMIT);

  return (
    <TeamsClient
      data={data}
      initialLoadLimit={TEAMS_ISR_LIMIT}
      year={year}
      initialFilters={{
        year: year === CURR_YEAR ? undefined : String(year),
        country: searchValue(params, "country"),
        state: searchValue(params, "state"),
        district: searchValue(params, "district"),
      }}
    />
  );
}
