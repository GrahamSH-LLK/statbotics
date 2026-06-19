import type { Metadata } from "next";

import { getNoteworthyMatches, getUpcomingMatches } from "../../api/matches";
import { CURR_YEAR } from "../../constants";
import { type SearchParams, searchValue, searchYear } from "../route-utils";
import MatchesClient from "./client";

export const metadata: Metadata = {
  title: "Matches - Statbotics",
};

export const revalidate = 60;

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const year = searchYear(params);
  const country = searchValue(params, "country") ?? "";
  const state = searchValue(params, "state") ?? "";
  const district = searchValue(params, "district") ?? "";
  const week = searchValue(params, "week") ?? "";
  const weekNum = week ? Number(week) : null;
  const playoff = "";
  const filterMatches = 15;
  const sortMatches = "max_epa";
  const [initialUpcoming, initialNoteworthy] = await Promise.all([
    year === CURR_YEAR
      ? getUpcomingMatches(country, state, district, playoff, String(filterMatches), sortMatches)
      : Promise.resolve(undefined),
    getNoteworthyMatches(year, country, state, district, playoff, weekNum),
  ]);

  return (
    <MatchesClient
      year={year}
      initialFilters={{
        year: year === CURR_YEAR ? undefined : String(year),
        week,
        country,
        state,
        district,
        playoff,
        filterMatches,
        sortMatches,
        refresh: 0,
      }}
      initialUpcoming={initialUpcoming}
      initialNoteworthy={initialNoteworthy}
    />
  );
}
