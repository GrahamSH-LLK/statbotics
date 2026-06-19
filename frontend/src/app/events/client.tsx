"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { validateFilters } from "../../components/filter";
import { CURR_YEAR } from "../../constants";
import Tabs from "../../pagesContent/events/tabs";
import PageLayout from "../../pagesContent/shared/layout";
import { EventsData } from "../../types/data";

export default function EventsClient({
  data,
  year,
  initialFilters,
}: {
  data?: EventsData;
  year: number;
  initialFilters: { [key: string]: any };
}) {
  const router = useRouter();
  const [filters, setFilters] = useState(() =>
    validateFilters(
      initialFilters,
      ["year", "week", "country", "state", "district", "search"],
      [undefined, "", "", "", "", ""]
    )
  );

  const setYear = (newYear: number) => {
    const params = new URLSearchParams();
    if (newYear !== CURR_YEAR) {
      params.set("year", String(newYear));
    }
    const query = params.toString();
    router.push(`/events${query ? `?${query}` : ""}`);
  };

  return (
    <PageLayout title="Events" year={year} setYear={setYear}>
      <Tabs data={data} error={!data} filters={filters} setFilters={setFilters} />
    </PageLayout>
  );
}
