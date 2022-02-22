// @flow
import { createSelector } from "reselect";
import type { Tag } from "src/redux/modules/tags";
import type { RootReducerState } from "src/redux/modules";

const getTags = (state: RootReducerState) => state.tags.list;
const getTeamId = (state: RootReducerState) => state.teams.activeTeamId;
const getSearch = (state: RootReducerState) => state.tags.search;

const selectSearch = createSelector(
  [getTags, getTeamId, getSearch],
  (tags, teamId, search) => ({
    ...search,
    select: ((search.results
      .map(id => tags.find(i => i.id === id))
      .filter(
        t =>
          typeof t !== "undefined" &&
          !!t &&
          !t.deleted_at &&
          `${t.team_id}` === `${teamId || ""}`
      ): any): Array<Tag>)
  })
);

export default selectSearch;
