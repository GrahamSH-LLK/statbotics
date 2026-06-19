"use client";

import React, { useEffect } from "react";

import BreakdownTable from "../../components/Table/BreakdownTable";
import { filterData } from "../../components/filter";
import { FilterBar } from "../../components/filterBar";
import { CURR_YEAR } from "../../constants";
import { TeamYearsData } from "../../types/data";

const EPABreakdownSection = ({
  year,
  data,
  filters,
  setFilters,
  totalRows,
  hasMoreRows,
  isLoadingMoreRows,
  onLoadMoreRows,
}: {
  year: number;
  data: TeamYearsData;
  filters: { [key: string]: any };
  setFilters: (filters: { [key: string]: any }) => void;
  totalRows?: number;
  hasMoreRows: boolean;
  isLoadingMoreRows: boolean;
  onLoadMoreRows: () => void | Promise<void>;
}) => {
  let defaultFilters = {
    country: "",
    state: "",
    district: "",
  };

  if (year === CURR_YEAR) {
    defaultFilters["is_competing"] = "";
  }

  const actualFilters = Object.keys(defaultFilters).reduce(
    (acc, key) => ({ ...acc, [key]: filters[key] || defaultFilters[key] }),
    {}
  );

  const hasActiveFilters = Object.keys(defaultFilters).some(
    (key) => actualFilters[key] !== defaultFilters[key]
  );

  useEffect(() => {
    if (hasActiveFilters && hasMoreRows && !isLoadingMoreRows) {
      onLoadMoreRows();
    }
  }, [hasActiveFilters, hasMoreRows, isLoadingMoreRows, onLoadMoreRows]);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex items-center justify-center">
        <FilterBar
          defaultFilters={defaultFilters}
          filters={actualFilters}
          setFilters={setFilters}
          includeProjections={false}
        />
      </div>
      <BreakdownTable
        year={year}
        yearData={data.year}
        data={filterData(data.team_years, actualFilters)}
        csvFilename={`${year}_epa_breakdown.csv`}
        totalRows={totalRows}
        hasMoreRows={hasMoreRows}
        isLoadingMoreRows={isLoadingMoreRows}
        onLoadMoreRows={onLoadMoreRows}
      />
    </div>
  );
};

export default EPABreakdownSection;
