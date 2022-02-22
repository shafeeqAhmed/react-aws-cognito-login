// @flow
import { createSelector } from "reselect";
import type { RootReducerState } from "src/redux/modules";
import type { Sound } from "../";

const getTeams = (state: RootReducerState) => state.teams.list;
const getActiveTeamId = (state: RootReducerState) => state.teams.activeTeamId;
const getSounds = (state: RootReducerState) => state.sounds.list;

type soundUploadSelector = (state: RootReducerState) => Array<Sound>;

const selectActiveTeamSoundUploads: soundUploadSelector = createSelector(
  [getTeams, getActiveTeamId, getSounds],
  (teams, teamId, sounds) =>
    sounds.filter(
      s =>
        teamId && `${s.team_id}` === `${teamId}` && !s.deleted_at && !!s.upload
    )
);

export default selectActiveTeamSoundUploads;
