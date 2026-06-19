import type { Metadata } from "next";

import { getYearEvents } from "../../api/events";
import { CURR_YEAR } from "../../constants";
import { type SearchParams, searchValue, searchYear } from "../route-utils";
import EventsClient from "./client";

export const metadata: Metadata = {
  title: "Events - Statbotics",
};

export const revalidate = 60;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const year = searchYear(params);
  const data = await getYearEvents(year);

  return (
    <EventsClient
      data={data}
      year={year}
      initialFilters={{
        year: year === CURR_YEAR ? undefined : String(year),
        week: searchValue(params, "week"),
        country: searchValue(params, "country"),
        state: searchValue(params, "state"),
        district: searchValue(params, "district"),
        search: searchValue(params, "search"),
      }}
    />
  );
}
