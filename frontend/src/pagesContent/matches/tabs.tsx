"use client";

import React, { useMemo } from "react";

import { CURR_YEAR } from "../../constants";
import TabsSection from "../shared/tabs";
import NoteworthyMatches from "./noteworthy";
import UpcomingMatches from "./upcoming";

const Tabs = ({
  year,
  error,
  filters,
  setFilters,
  initialUpcoming,
  initialNoteworthy,
}: {
  year: number;
  error: boolean;
  filters: { [key: string]: any };
  setFilters: (filters: { [key: string]: any }) => void;
  initialUpcoming?: any;
  initialNoteworthy?: any;
}) => {
  const MemoizedUpcoming = useMemo(
    () => (
      <UpcomingMatches
        filters={filters}
        setFilters={(newFilters) => setFilters({ ...filters, ...newFilters })}
        initialData={initialUpcoming}
      />
    ),
    [filters, setFilters, initialUpcoming]
  );
  const MemoizedNoteworthy = useMemo(
    () => (
      <NoteworthyMatches
        year={year}
        filters={filters}
        setFilters={(newFilters) => setFilters({ ...filters, ...newFilters })}
        initialData={initialNoteworthy}
      />
    ),
    [year, filters, setFilters, initialNoteworthy]
  );

  const tabs = [
    year === CURR_YEAR && { title: "Upcoming", content: MemoizedUpcoming },
    { title: "Noteworthy", content: MemoizedNoteworthy },
  ].filter(Boolean);

  return <TabsSection loading={false} error={error} tabs={tabs} />;
};

export default Tabs;
