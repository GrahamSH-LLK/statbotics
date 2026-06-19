"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { validateFilters } from "../../components/filter";
import { CURR_YEAR } from "../../constants";
import Tabs from "../../pagesContent/matches/tabs";
import PageLayout from "../../pagesContent/shared/layout";

export default function MatchesClient({
  year,
  initialFilters,
  initialUpcoming,
  initialNoteworthy,
}: {
  year: number;
  initialFilters: { [key: string]: any };
  initialUpcoming?: any;
  initialNoteworthy?: any;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState(() =>
    validateFilters(
      initialFilters,
      ["year", "week", "country", "state", "district"],
      [undefined, "", "", "", ""]
    )
  );

  const setYear = (newYear: number) => {
    const params = new URLSearchParams();
    if (newYear !== CURR_YEAR) {
      params.set("year", String(newYear));
    }
    const query = params.toString();
    router.push(`/matches${query ? `?${query}` : ""}`);
  };

  return (
    <PageLayout title="Matches" year={year} setYear={setYear}>
      <Tabs
        year={year}
        error={false}
        filters={filters}
        setFilters={setFilters}
        initialUpcoming={initialUpcoming}
        initialNoteworthy={initialNoteworthy}
      />
    </PageLayout>
  );
}
