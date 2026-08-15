import { BsTwitch } from "react-icons/bs";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCachedEvent } from "../../../api/server-cache";
import Tabs from "../../../pagesContent/event/[event_id]/tabs";
import { formatEventName } from "../../../utils";

export const revalidate = 60;

type EventParams = Promise<{ event_id: string }>;

export async function generateMetadata({ params }: { params: EventParams }): Promise<Metadata> {
  const { event_id } = await params;
  const data = await getCachedEvent(event_id);

  return {
    title: data?.event?.name ? `${data.event.name} - Statbotics` : `${event_id} - Statbotics`,
  };
}

export default async function EventPage({ params }: { params: EventParams }) {
  const { event_id } = await params;
  const data = await getCachedEvent(event_id);

  if (!data?.event) {
    notFound();
  }

  const truncatedEventName = formatEventName(data.event.name, 30);
  const status = data.event.status;

  return (
    <div className="w-full h-full flex-grow flex flex-col pt-4 md:pt-8 md:pb-4 md:px-4">
      <div className="w-full flex flex-wrap items-center justify-center mb-4 gap-4">
        <p className="text-2xl lg:text-3xl max-w-full">
          {data.year.year} {truncatedEventName}
        </p>
        <div className="flex">
          <Link
            href={`https://www.thebluealliance.com/event/${event_id}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image src="/tba.png" alt="TBA" height={28} width={28} />
          </Link>

          {status === "Ongoing" && (
            <Link
              href={`https://www.thebluealliance.com/gameday/${event_id}`}
              rel="noopener noreferrer"
              target="_blank"
              className="ml-2 text-sm"
              style={{ color: "#9146FD" }}
            >
              <BsTwitch className="text-2xl" size={28} />
            </Link>
          )}
        </div>
      </div>
      <Tabs eventId={event_id} year={data.year.year} data={data} />
    </div>
  );
}
