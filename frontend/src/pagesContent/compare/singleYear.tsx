"use client";

import React from "react";

import YearLineChart from "../../components/Figures/YearLine";
import { CURR_YEAR } from "../../constants";
import { APITeamYear } from "../../types/api";
import { ShortTeam } from "../../types/data";

const SingleYear = ({ teams, teamYears }: { teams: ShortTeam[]; teamYears: APITeamYear[] }) => {
  const lineData = teams
    .filter((team) => team?.active ?? true)
    .map((team) => ({
      value: team.team,
      label: `${team.team} | ${team.name}`,
    }))
    .sort((a, b) => parseInt(a.value) - parseInt(b.value));

  return (
    <div className="mb-4">
      <YearLineChart year={CURR_YEAR} teamYears={teamYears} teams={lineData} />
    </div>
  );
};

export default SingleYear;
