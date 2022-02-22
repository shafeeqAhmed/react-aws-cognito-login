// @flow
import { createSelector } from "reselect";
import { get } from "lodash";
import { EntityTypes } from "src/redux/modules/tags";
import type { Sound } from "src/redux/modules/sounds";
import type { RootReducerState } from "src/redux/modules";

const getTeams = (state: RootReducerState) => state.teams.list;
const getActiveTeamId = (state: RootReducerState) => state.teams.activeTeamId;
const getProductions = (state: RootReducerState) =>
  state.productions.productions;
const getTags = (state: RootReducerState) => state.tags.list;
const getSounds = (state: RootReducerState) => state.sounds.list;

const selectActiveTeamSounds = createSelector(
  [getTeams, getProductions, getTags, getActiveTeamId, getSounds],
  (teams, productions, tags, teamId, sounds) =>
    sounds
      .filter(s => `${s.team_id}` === `${teamId || ""}` && !s.deleted_at)
      .map(
        s =>
          ({
            ...s,
            productions: get(s, "productions", []).map(sp => ({
              ...sp,
              production: productions.find(p => p.id === sp.production_id)
            })),
            tags: tags.filter(t =>
              t.entities.some(
                e =>
                  e.entity_id === s.id &&
                  e.entity_type === EntityTypes.SOUND &&
                  !t.deleted_at
              )
            )
          }: Sound)
      )
);

export default selectActiveTeamSounds;
