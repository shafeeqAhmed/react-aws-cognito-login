// @flow
import { createSelector } from "reselect";
import type { Sound } from "src/redux/modules/sounds";
import type { RootReducerState } from "src/redux/modules";

const getSounds = (state: RootReducerState) => state.sounds.list;
const getTeamId = (state: RootReducerState) => state.teams.activeTeamId;
const getSearch = (state: RootReducerState) => state.sounds.search;

const selectSearch = createSelector(
  [getSounds, getTeamId, getSearch],
  (sounds, teamId, search) => ({
    ...search,
    select: ((search.results
      .map(id => sounds.find(i => i.id === id))
      .filter(
        s =>
          typeof s !== "undefined" &&
          !!s &&
          !s.deleted_at &&
          `${s.team_id}` === `${teamId || ""}`
      ): any): Array<Sound>)
  })
);

export default selectSearch;
