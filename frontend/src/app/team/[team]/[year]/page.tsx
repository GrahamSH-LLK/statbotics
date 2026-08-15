import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getCachedTeamYear } from "../../../../api/server-cache";
import { CURR_YEAR } from "../../../../constants";
import PageContent from "../../../../pagesContent/team/main";
import { clampedTeamYear } from "../../../route-utils";

type TeamYearParams = Promise<{ team: string; year: string }>;

export const revalidate = 60;

export async function generateMetadata({ params }: { params: TeamYearParams }): Promise<Metadata> {
  const { team, year } = await params;
  return {
    title: `Team ${team} ${year} - Statbotics`,
  };
}

export default async function TeamYearPage({ params }: { params: TeamYearParams }) {
  const { team, year } = await params;
  const teamNum = Number(team);
  const urlYear = clampedTeamYear(year);

  if (!Number.isFinite(teamNum)) {
    notFound();
  }

  if (String(urlYear) !== year && !(year === "-1" && urlYear === CURR_YEAR)) {
    redirect(`/team/${teamNum}/${urlYear}`);
  }

  const data = await getCachedTeamYear(teamNum, urlYear);

  if (!data) {
    notFound();
  }

  if (!("team_year" in data)) {
    const lastActiveYear = data.team_active_years?.last_active_year;
    if (lastActiveYear && lastActiveYear !== urlYear) {
      redirect(`/team/${teamNum}/${lastActiveYear}`);
    }
    notFound();
  }

  return <PageContent team={teamNum} paramYear={urlYear} initialTeamYearData={data} />;
}
