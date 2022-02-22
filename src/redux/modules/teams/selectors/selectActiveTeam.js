// @flow
import { createSelector } from "reselect";
import type { RootReducerState } from "src/redux/modules";
import type { Team } from "../";

const getTeams = (state: RootReducerState) => state.teams.list;

const getActiveTeamId = (state: RootReducerState) => state.teams.activeTeamId;

type teamSelector = (state: RootReducerState) => ?Team;

const selectActiveTeam: teamSelector = createSelector(
  [getTeams, getActiveTeamId],
  (teams, teamId) =>
    teamId ? teams.find(t => `${t.id}` === `${teamId}`) : null
);

export default selectActiveTeam;
