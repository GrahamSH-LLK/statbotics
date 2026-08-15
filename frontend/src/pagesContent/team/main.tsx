"use client";

import React, { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

import Image from "next/image";
import Link from "next/link";

import { getTeamYear } from "../../api/team";
import { CURR_YEAR } from "../../constants";
import { TeamYearData, TeamYearRedirect } from "../../types/data";
import PageLayout from "../shared/layout";
import NotFound from "../shared/notFound";
import SummaryTabs from "./summaryTabs";
import Tabs from "./tabs";

type TeamYearKey = ["team-year", number, number];

const fetchTeamYear = ([, team, year]: TeamYearKey) => getTeamYear(team, year);

const PageContent = ({
  team,
  paramYear,
  initialTeamYearData,
}: {
  team: number;
  paramYear: number;
  initialTeamYearData?: TeamYearData;
}) => {
  const [prevYear, _setPrevYear] = useState(paramYear);
  const [year, _setYear] = useState(paramYear);

  const setYear = useCallback(
    (newYear: number) => {
      _setPrevYear(year);
      _setYear(newYear);
    },
    [year]
  );

  const shouldLoadTeamYear = !isNaN(team) && year >= 2002 && year <= CURR_YEAR;
  const { data } = useSWR<TeamYearData | TeamYearRedirect | undefined>(
    shouldLoadTeamYear ? ["team-year", team, year] : null,
    fetchTeamYear,
    {
      fallbackData: year === paramYear ? initialTeamYearData : undefined,
      keepPreviousData: true,
      revalidateOnMount: !initialTeamYearData,
    }
  );

  useEffect(() => {
    if (!data || "team_year" in data) {
      return;
    }

    const lastActiveYear = data.team_active_years?.last_active_year;
    if (lastActiveYear && year !== lastActiveYear) {
      setYear(lastActiveYear);
    }
  }, [data, setYear, year]);

  const loadedTeamYearData = data && "team_year" in data ? data : undefined;
  const teamYearData =
    loadedTeamYearData?.team_year?.year === year ? loadedTeamYearData : undefined;
  const fallbackTeamYearData =
    loadedTeamYearData ?? (prevYear === paramYear ? initialTeamYearData : undefined);

  if (!teamYearData && !fallbackTeamYearData) {
    return <NotFound type="Team" />;
  }

  const effectiveData = teamYearData ?? fallbackTeamYearData;
  const rookieYear = effectiveData?.team?.rookie_year ?? 2002;
  const lastActiveYear = effectiveData?.team?.last_active_year;
  const lastYear = lastActiveYear ? Math.min(lastActiveYear, CURR_YEAR) : CURR_YEAR;

  const yearOptions = Array.from(
    { length: lastYear - rookieYear + 1 },
    (_, i) => rookieYear + i
  ).reverse();

  const teamName = effectiveData?.team_year?.name;

  return (
    <PageLayout
      title={`Team ${team}`}
      year={year}
      setYear={setYear}
      years={yearOptions}
      includeSummary
    >
      <div className="w-full flex items-center justify-center mb-4">
        <div className="text-2xl lg:text-3xl">{teamName}</div>
        <Link
          href={`https://www.thebluealliance.com/team/${team}`}
          rel="noopener noreferrer"
          target="_blank"
          className="ml-4"
        >
          <Image src="/tba.png" alt="TBA" width={28} height={28} />
        </Link>
      </div>
      {year >= 2002 && year <= CURR_YEAR ? (
        <Tabs
          teamNum={team}
          year={year}
          teamYearData={teamYearData}
          fallbackTeamYearData={fallbackTeamYearData}
        />
      ) : (
        <SummaryTabs team={team} />
      )}
    </PageLayout>
  );
};

export default PageContent;
