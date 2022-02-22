// @flow
import * as api from "./api";
import { get } from "lodash";
import { upsert } from "src/helpers/lodash";

export * from "./selectors";

export const FETCH_TEAMS: "procliq-web-editor/teams/FETCH_TEAMS" =
  "procliq-web-editor/teams/FETCH_TEAMS";

export const SET_ACTIVE_TEAM: "procliq-web-editor/teams/SET_ACTIVE_TEAM" =
  "procliq-web-editor/teams/SET_ACTIVE_TEAM";

export type Team = {|
  +id: number,
  +name?: string,
  +role?: string
|};

export type State = {|
  +list: Array<Team>,
  +activeTeamId: ?string,
  +isFetching: ?boolean,
  +error: ?string
|};

export const initialState: State = {
  list: [],
  activeTeamId: null,
  isFetching: false,
  error: null
};

export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${FETCH_TEAMS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_TEAMS}_FULFILLED`: {
      const teams = get(action, "payload.data.items", []);

      const list = teams.reduce(
        (l, t) => upsert(l, t, team => team.id === t.id),
        state.list.slice()
      );

      return {
        ...state,
        list,
        isFetching: false,
        error: null
      };
    }

    case `${FETCH_TEAMS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case SET_ACTIVE_TEAM:
      return {
        ...state,
        activeTeamId: get(action, "payload.teamId", state.activeTeamId)
      };

    default:
      return state;
  }
}

export const fetchTeams = () => ({
  type: FETCH_TEAMS,
  payload: api.listTeams({}),
  meta: { request: {} }
});

export const setActiveTeam = (request: { teamId: number }) => ({
  type: SET_ACTIVE_TEAM,
  payload: request,
  meta: { request }
});
