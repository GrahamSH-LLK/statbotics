import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTeamYear } from "../../../api/team";
import { CURR_YEAR } from "../../../constants";
import PageContent from "../../../pagesContent/team/main";

type TeamParams = Promise<{ team: string }>;

export const revalidate = 60;

export async function generateMetadata({ params }: { params: TeamParams }): Promise<Metadata> {
  const { team } = await params;
  return {
    title: `Team ${team} - Statbotics`,
  };
}

export default async function TeamPage({ params }: { params: TeamParams }) {
  const { team } = await params;
  const teamNum = Number(team);

  if (!Number.isFinite(teamNum)) {
    notFound();
  }

  const data = await getTeamYear(teamNum, CURR_YEAR);

  if (!data || !("team_year" in data)) {
    notFound();
  }

  return <PageContent team={teamNum} paramYear={CURR_YEAR} initialTeamYearData={data} />;
}
