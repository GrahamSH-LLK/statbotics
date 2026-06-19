"use client";

import React, { useMemo } from "react";

import { APITeamYear } from "../../types/api";
import { ShortTeam } from "../../types/data";
import PageLayout from "../shared/layout";
import TabsSection from "../shared/tabs";
import MultiYear from "./multiYear";
import SingleYear from "./singleYear";

const Tabs = ({ teams, teamYears }: { teams: ShortTeam[]; teamYears: APITeamYear[] }) => {
  const MemoizedSingleYear = useMemo(
    () => <SingleYear teams={teams} teamYears={teamYears} />,
    [teams, teamYears]
  );
  const MemoizedMultiYear = useMemo(() => <MultiYear teams={teams} />, [teams]);

  let tabs = [
    { title: "This Year", content: MemoizedSingleYear },
    { title: "All Time", content: MemoizedMultiYear },
  ].filter((tab) => tab.title !== "");

  return (
    <PageLayout title="Compare Teams">
      <TabsSection loading={teams?.length === 0} error={false} tabs={tabs} />
    </PageLayout>
  );
};

export default Tabs;
