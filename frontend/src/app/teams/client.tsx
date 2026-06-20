"use client";

import React, { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { getYearTeamYears } from "../../api/teams";
import { validateFilters } from "../../components/filter";
import { CURR_YEAR } from "../../constants";
import PageLayout from "../../pagesContent/shared/layout";
import Tabs from "../../pagesContent/teams/tabs";
import { TeamYearsData } from "../../types/data";

function getTeamCount(data?: TeamYearsData, fallback = 0) {
  return Math.max(data?.team_years?.[0]?.epa?.ranks?.total?.team_count ?? 0, fallback);
}

export default function TeamsClient({
  data,
  initialLoadLimit,
  year,
  initialFilters,
}: {
  data?: TeamYearsData;
  initialLoadLimit: number;
  year: number;
  initialFilters: { [key: string]: any };
}) {
  const router = useRouter();
  const [teamData, setTeamData] = useState(data);
  const [totalTeamCount, setTotalTeamCount] = useState(
    getTeamCount(data, data?.team_years?.length ?? 0)
  );
  const [hasLoadedAllTeams, setHasLoadedAllTeams] = useState(
    (data?.team_years?.length ?? 0) < initialLoadLimit
  );
  const [isLoadingAllTeams, setIsLoadingAllTeams] = useState(false);
  const [loadAllTeamsError, setLoadAllTeamsError] = useState(false);
  const [filters, setFilters] = useState(() =>
    validateFilters(
      {
        ...initialFilters,
        is_competing: year === CURR_YEAR ? "" : undefined,
      },
      ["year", "country", "state", "district"],
      [undefined, "", "", ""]
    )
  );

  useEffect(() => {
    setTeamData(data);
    setTotalTeamCount(getTeamCount(data, data?.team_years?.length ?? 0));
    setHasLoadedAllTeams((data?.team_years?.length ?? 0) < initialLoadLimit);
    setIsLoadingAllTeams(false);
    setLoadAllTeamsError(false);
  }, [data, initialLoadLimit, year]);

  const setYear = (newYear: number) => {
    const params = new URLSearchParams();
    if (newYear !== CURR_YEAR) {
      params.set("year", String(newYear));
    }
    const query = params.toString();
    router.push(`/teams${query ? `?${query}` : ""}`);
  };

  const loadAllTeams = useCallback(async () => {
    if (hasLoadedAllTeams || isLoadingAllTeams) {
      return;
    }

    setIsLoadingAllTeams(true);
    setLoadAllTeamsError(false);

    try {
      const response = await getYearTeamYears(year);
      if (!response || !response.team_years || response.team_years.length === 0) {
        throw new Error("Failed to load all teams");
      }
      setTeamData(response);
      setTotalTeamCount(getTeamCount(response, response?.team_years?.length ?? totalTeamCount));
      setHasLoadedAllTeams(true);
    } catch {
      setLoadAllTeamsError(true);
    } finally {
      setIsLoadingAllTeams(false);
    }
  }, [hasLoadedAllTeams, isLoadingAllTeams, totalTeamCount, year]);

  const hasMoreTeams = !hasLoadedAllTeams && (teamData?.team_years?.length ?? 0) < totalTeamCount;

  return (
    <PageLayout title="Teams" year={year} setYear={setYear}>
      <Tabs
        year={year}
        data={teamData}
        error={!teamData}
        filters={filters}
        setFilters={setFilters}
        totalRows={totalTeamCount}
        hasMoreRows={hasMoreTeams}
        isLoadingMoreRows={isLoadingAllTeams}
        loadMoreRowsError={loadAllTeamsError}
        onLoadMoreRows={loadAllTeams}
      />
    </PageLayout>
  );
}
