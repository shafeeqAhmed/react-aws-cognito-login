// @flow
import { createSelector } from "reselect";
import type { RootReducerState } from "src/redux/modules";

const getTeams = (state: RootReducerState) => state.teams.list;

const getTeamId = (_: RootReducerState, teamId: string) => teamId;

const selectTeamById = createSelector([getTeams, getTeamId], (teams, teamId) =>
  teams.find(t => teamId && `${t.id}` === `${teamId}`)
);

export default selectTeamById;
