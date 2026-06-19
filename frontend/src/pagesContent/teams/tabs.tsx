"use client";

import React, { useMemo } from "react";

import BubbleChart from "../../components/Figures/Bubble";
import { BREAKDOWN_YEARS, CURR_YEAR, RP_NAMES } from "../../constants";
import { TeamYearsData, emptyTeamYearsData } from "../../types/data";
import TabsSection from "../shared/tabs";
import BreakdownTable from "./breakdownTable";
import FigureSection from "./figures";
import InsightsTable from "./insightsTable";

const Tabs = ({
  year,
  data,
  error,
  filters,
  setFilters,
  totalRows,
  hasMoreRows,
  isLoadingMoreRows,
  loadMoreRowsError,
  onLoadMoreRows,
}: {
  year: number;
  data: TeamYearsData | undefined;
  error: boolean;
  filters: { [key: string]: any };
  setFilters: (filters: { [key: string]: any }) => void;
  totalRows?: number;
  hasMoreRows: boolean;
  isLoadingMoreRows: boolean;
  loadMoreRowsError: boolean;
  onLoadMoreRows: () => void | Promise<void>;
}) => {
  const MemoizedInsightsTable = useMemo(
    () => (
      <InsightsTable
        year={year}
        data={data || emptyTeamYearsData}
        filters={filters}
        setFilters={(newFilters) => setFilters({ ...filters, ...newFilters })}
        totalRows={totalRows}
        hasMoreRows={hasMoreRows}
        isLoadingMoreRows={isLoadingMoreRows}
        onLoadMoreRows={onLoadMoreRows}
      />
    ),
    [year, data, filters, setFilters, totalRows, hasMoreRows, isLoadingMoreRows, onLoadMoreRows]
  );

  const MemoizedBreakdownTable = useMemo(
    () =>
      BREAKDOWN_YEARS.includes(year) && (
        <BreakdownTable
          year={year}
          data={data || emptyTeamYearsData}
          filters={filters}
          setFilters={(newFilters) => setFilters({ ...filters, ...newFilters })}
          totalRows={totalRows}
          hasMoreRows={hasMoreRows}
          isLoadingMoreRows={isLoadingMoreRows}
          onLoadMoreRows={onLoadMoreRows}
        />
      ),
    [year, data, filters, setFilters, totalRows, hasMoreRows, isLoadingMoreRows, onLoadMoreRows]
  );

  const MemoizedBubbleChart = useMemo(
    () => (
      <BubbleChart
        year={year}
        data={data?.team_years ?? []}
        defaultFilters={{ country: "", state: "", district: "" }}
        filters={filters}
        setFilters={(newFilters) => setFilters({ ...filters, ...newFilters })}
        columnOptions={
          [
            "Total EPA",
            year >= CURR_YEAR && "Unitless EPA",
            year >= 2016 && "Auto",
            year >= 2016 && "Teleop",
            year >= 2016 && "Endgame",
            year >= 2016 && "Auto + Endgame",
            year >= 2016 && `${RP_NAMES[year][0]}`,
            year >= 2016 && `${RP_NAMES[year][1]}`,
            "Wins",
            "Win Rate",
          ].filter(Boolean) as string[]
        }
      />
    ),
    [year, data, filters, setFilters]
  );

  const MemoizedFigureSection = useMemo(
    () => <FigureSection year={year} data={data || emptyTeamYearsData} />,
    [year, data]
  );

  const tabs = [
    { title: "Insights", content: MemoizedInsightsTable },
    BREAKDOWN_YEARS.includes(year) && { title: "Breakdown", content: MemoizedBreakdownTable },
    { title: "Bubble Chart", content: MemoizedBubbleChart },
    { title: "Figures", content: MemoizedFigureSection },
  ].filter(Boolean);

  return (
    <>
      {hasMoreRows && (isLoadingMoreRows || loadMoreRowsError) && (
        <div className="w-full flex items-center justify-center pb-4 text-sm text-gray-600">
          {isLoadingMoreRows
            ? "Loading all teams..."
            : "Unable to load all teams. Please try again."}
        </div>
      )}
      <TabsSection loading={data === undefined} error={error} tabs={tabs} />
    </>
  );
};

export default Tabs;
