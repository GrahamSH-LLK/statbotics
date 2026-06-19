import { NextResponse } from "next/server";

import { getYearTeamYears } from "../../../../api/teams";

export async function GET(_request: Request, { params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const parsedYear = Number(year);

  if (!Number.isInteger(parsedYear)) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  const data = await getYearTeamYears(parsedYear);

  if (!data) {
    return NextResponse.json({ error: "Unable to load team years" }, { status: 502 });
  }

  return NextResponse.json(data);
}
