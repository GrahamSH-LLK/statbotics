import { cache } from "react";

import { getAllEvents, getAllTeams } from "./header";
import { getEvent } from "./event";
import { getMatch } from "./match";
import { getTeamYear } from "./team";

export const getCachedAllTeams = cache(getAllTeams);
export const getCachedAllEvents = cache(getAllEvents);
export const getCachedEvent = cache(getEvent);
export const getCachedMatch = cache(getMatch);
export const getCachedTeamYear = cache(getTeamYear);
