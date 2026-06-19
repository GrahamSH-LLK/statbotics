"use client";

import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { MdAdd, MdClose, MdCloudDownload, MdColorLens, MdRemove, MdSearch } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";

import { ColumnDef } from "@tanstack/react-table";

import { classnames } from "../../utils";
import Table from "./Table";
import { TableKey } from "./shared";

const InsightsTable = ({
  title,
  data,
  columns,
  detailedData = [],
  detailedColumns = [],
  searchCols,
  csvFilename,
  toggleDisableHighlight,
  includeKey = true,
  totalRows,
  hasMoreRows = false,
  isLoadingMoreRows = false,
  onLoadMoreRows,
}: {
  title: string;
  data: any[];
  columns: ColumnDef<any, any>[];
  detailedData?: any[];
  detailedColumns?: ColumnDef<any, any>[];
  searchCols: string[];
  csvFilename: string;
  toggleDisableHighlight?: () => void;
  includeKey?: boolean;
  totalRows?: number;
  hasMoreRows?: boolean;
  isLoadingMoreRows?: boolean;
  onLoadMoreRows?: () => void | Promise<void>;
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [canDownloadCsv, setCanDownloadCsv] = useState(false);
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const [expanded, setExpanded] = useState(false);

  const expandable = detailedData?.length > 0;
  const currData = expanded ? detailedData : data;
  const currColumns = expanded ? detailedColumns : columns;

  const filteredData = currData.filter((row) =>
    searchCols.some((col) => row[col].toString().toLowerCase().includes(search.toLowerCase()))
  );

  const headerClassName = () => "border-b-2 border-gray-800";

  const headerCellClassName = (header: any) => classnames("px-1 md:px-2 py-2");

  const rowClassName = (row: any) =>
    classnames(
      "text-center h-14 md:hover:bg-blue-100",
      row?.original?.next_event_key && row?.original?.record === "0-0-0" && "bg-yellow-50", // teams page
      row?.original?.first_event && row?.original?.rank === -1 && "bg-yellow-50" // event page
    );

  const cellClassName = (cell: any) => classnames("py-2");

  useEffect(() => {
    setCanDownloadCsv(true);
  }, []);

  useEffect(() => {
    if (search && hasMoreRows && !isLoadingMoreRows) {
      onLoadMoreRows?.();
    }
  }, [hasMoreRows, isLoadingMoreRows, onLoadMoreRows, search]);

  return (
    <div className="w-full md:w-fit md:max-w-full text-sm mb-4">
      <div className="w-full px-2 py-1 flex items-center justify-center">
        <div className="flex-grow">
          {showSearch ? (
            <div className="flex">
              <input
                className="w-36 md:w-60 p-2 relative rounded text-sm border-[2px] border-inputBlue focus:outline-none"
                placeholder="Search"
                value={searchInput}
                onBlur={() => {
                  debouncedSetSearch.cancel();
                  setSearch(searchInput);
                }}
                onChange={(e) => {
                  const { value } = e.target;
                  const shouldClearSearch = searchInput.length > value.length && value.length < 2;

                  setSearchInput(value);

                  if (value.length >= 2) {
                    debouncedSetSearch(value);
                  } else if (shouldClearSearch) {
                    debouncedSetSearch("");
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    debouncedSetSearch.cancel();
                    setSearch(searchInput);
                  }
                }}
              />
              <MdClose
                className="hover_icon ml-2"
                onClick={() => {
                  debouncedSetSearch.cancel();
                  setSearchInput("");
                  setSearch("");
                  setShowSearch(!showSearch);
                }}
              />
            </div>
          ) : (
            <div className="text-lg text-gray-800">{title}</div>
          )}
        </div>
        <div className="tooltip" data-tip="Search">
          <MdSearch className="hover_icon ml-2" onClick={() => setShowSearch(!showSearch)} />
        </div>
        {toggleDisableHighlight && (
          <div className="tooltip" data-tip="Toggle Highlight">
            <MdColorLens className="hover_icon ml-2" onClick={toggleDisableHighlight} />
          </div>
        )}
        <div className="tooltip" data-tip="Download CSV">
          {canDownloadCsv ? (
            <CSVLink data={filteredData} filename={csvFilename}>
              <MdCloudDownload className="hover_icon ml-2" />
            </CSVLink>
          ) : (
            <MdCloudDownload className="hover_icon ml-2" />
          )}
        </div>
        {expandable && (
          <div className="tooltip" data-tip={expanded ? "Shrink" : "Expand"}>
            <MdAdd
              className="hover_icon ml-2"
              onClick={() => setExpanded(!expanded)}
              style={{ display: expanded ? "none" : "block" }}
            />
            <MdRemove
              className="hover_icon ml-2"
              onClick={() => setExpanded(!expanded)}
              style={{ display: expanded ? "block" : "none" }}
            />
          </div>
        )}
      </div>
      <div className="h-2" />
      <div className="overflow-x-scroll overflow-y-hidden scrollbar-hide">
        <Table
          data={filteredData}
          columns={currColumns}
          paginate={true}
          headerClassName={headerClassName}
          headerCellClassName={headerCellClassName}
          rowClassName={rowClassName}
          cellClassName={cellClassName}
          totalRows={search ? undefined : totalRows}
          isLoadingMoreRows={isLoadingMoreRows}
          onLoadMoreRows={hasMoreRows ? onLoadMoreRows : undefined}
        />
      </div>
      {includeKey && <TableKey />}
    </div>
  );
};

export default InsightsTable;
