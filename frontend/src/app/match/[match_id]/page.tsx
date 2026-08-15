import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCachedMatch } from "../../../api/server-cache";
import ImageRow from "../../../pagesContent/match/[match_id]/imageRow";
import Summary from "../../../pagesContent/match/[match_id]/summary";
import MatchTable from "../../../pagesContent/match/[match_id]/table";
import Video from "../../../pagesContent/match/[match_id]/video";
import { formatEventName } from "../../../utils";

export const revalidate = 60;

type MatchParams = Promise<{ match_id: string }>;

export async function generateMetadata({ params }: { params: MatchParams }): Promise<Metadata> {
  const { match_id } = await params;
  const data = await getCachedMatch(match_id);

  return {
    title: data?.match?.match_name
      ? `${data.match.match_name} - Statbotics`
      : `${match_id} - Statbotics`,
  };
}

export default async function MatchPage({ params }: { params: MatchParams }) {
  const { match_id } = await params;
  const data = await getCachedMatch(match_id);

  if (!data?.match || !data?.event) {
    notFound();
  }

  const truncatedEventName = formatEventName(data.event.name, 40);

  const prevMatch =
    !data.match.elim && data.match.match_number > 1
      ? `${data.match.event}_qm${data.match.match_number - 1}`
      : null;

  const nextMatch =
    !data.match.elim && data.match.match_number < data.event.qual_matches
      ? `${data.match.event}_qm${data.match.match_number + 1}`
      : null;

  return (
    <div className="w-full h-full p-4">
      <div className="container mx-auto">
        <div className="w-full flex flex-row justify-center items-center mb-4">
          {prevMatch ? (
            <Link href={`/match/${prevMatch}`} className="mr-16">
              <BsArrowLeft className="text-3xl lg:text-4xl text_link" />
            </Link>
          ) : (
            <BsArrowLeft className="text-3xl lg:text-4xl text-white mr-16" />
          )}
          <div className="flex flex-row flex-wrap items-end justify-center">
            <p className="text-3xl lg:text-4xl">{data.match.match_name}</p>
            <Link href={`/event/${data.match.event}`} className="lg:text-2xl ml-2 text_link">
              {truncatedEventName}
            </Link>
          </div>
          {nextMatch ? (
            <Link href={`/match/${nextMatch}`} className="ml-16">
              <BsArrowRight className="text-3xl lg:text-4xl text_link" />
            </Link>
          ) : (
            <BsArrowRight className="text-3xl lg:text-4xl text-white ml-16" />
          )}
        </div>
        <div className="w-full flex flex-row flex-wrap justify-center">
          <Summary data={data} />
          <MatchTable data={data} />
          <ImageRow data={data} />
          <Video video={data.match.video ?? ""} />
        </div>
      </div>
    </div>
  );
}
