// @flow
import { get, findIndex } from "lodash";
import * as api from "./api";
import { sendProductionWidget } from "src/helpers/widget";

export * from "./selectors";

/**
 * Action types.
 */
export const FETCH_PRODUCTIONS: "procliq-web-editor/productions/FETCH_PRODUCTIONS" =
  "procliq-web-editor/productions/FETCH_PRODUCTIONS";
export const SELECT_PRODUCTION: "procliq-web-editor/productions/SELECT_PRODUCTION" =
  "procliq-web-editor/productions/SELECT_PRODUCTION";
export const FETCH_PRODUCTION_TYPES: "procliq-web-editor/productions/FETCH_PRODUCTION_TYPES" =
  "procliq-web-editor/productions/FETCH_PRODUCTION_TYPES";
export const FETCH_PRODUCTION_DETAILS: "procliq-web-editor/productions/FETCH_PRODUCTION_DETAILS" =
  "procliq-web-editor/productions/FETCH_PRODUCTION_DETAILS";
export const EDIT_PRODUCTION: "procliq-web-editor/productions/EDIT_PRODUCTION" =
  "procliq-web-editor/productions/EDIT_PRODUCTION";
export const DELETE_PRODUCTION: "procliq-web-editor/productions/DELETE_PRODUCTION" =
  "procliq-web-editor/productions/DELETE_PRODUCTION";
export const LEAVE_PRODUCTION: "procliq-web-editor/productions/LEAVE_PRODUCTION" =
  "procliq-web-editor/productions/LEAVE_PRODUCTION";
export const FETCH_INVITATIONS: "procliq-web-editor/productions/FETCH_INVITATIONS" =
  "procliq-web-editor/productions/FETCH_INVITATIONS";
export const ACCEPT_INVITATION: "procliq-web-editor/productions/ACCEPT_INVITATION" =
  "procliq-web-editor/productions/ACCEPT_INVITATION";
export const SET_NEW_TEAM_NAME: "procliq-web-editor/productions/SET_NEW_TEAM_NAME" =
  "procliq-web-editor/productions/SET_NEW_TEAM_NAME";
export const CREATE_NEW_TEAM: "procliq-web-editor/productions/CREATE_NEW_TEAM" =
  "procliq-web-editor/productions/CREATE_NEW_TEAM";
export const CREATE_NEW_PRODUCTION: "procliq-web-editor/productions/CREATE_NEW_PRODUCTION" =
  "procliq-web-editor/productions/CREATE_NEW_PRODUCTION";
export const SET_PRODUCTION_POSTER: "procliq-web-editor/productions/SET_PRODUCTION_POSTER" =
  "procliq-web-editor/productions/SET_PRODUCTION_POSTER";
export const SEND_INVITATIONS: "procliq-web-editor/productions/SEND_INVITATIONS" =
  "procliq-web-editor/productions/SEND_INVITATIONS";

/**
 * State definition.
 */

export type ProductionType = {
  +id: number,
  +name: string,
  +sequence: number
};

export type Production = {
  +id: number,
  +name?: string,
  +number?: ?string,
  +year?: number,
  +createdAt?: string,
  +type?: ?ProductionType,
  +team?: ?{
    +id: number,
    +name: string,
    +role: ?string
  },
  +poster?: ?{
    +baseUrl: string,
    +name: string,
    +urls: Array<string>
  },
  +owner?: ?{
    +id: string,
    +name: string,
    +mention: string,
    +avatar: ?string
  },
  +permission?: string,
  +budget?: ?number,
  +currency?: Object,
  +productionCompany?: string
};

export const InvitationStatuses = {
  PENDING: ("PENDING": "PENDING"),
  ACCEPTED: ("ACCEPTED": "ACCEPTED"),
  REJECTED: ("REJECTED": "REJECTED"),
  LEFT: ("LEFT": "LEFT"),
  REMOVED: ("REMOVED": "REMOVED")
};

export type InvitationStatus = $Values<typeof InvitationStatuses>;

export const InvitationPermissions = {
  USER: ("USER": "USER"),
  ADMIN: ("ADMIN": "ADMIN"),
  SUPER_ADMIN: ("SUPER_ADMIN": "SUPER_ADMIN")
};

export type InvitationPermission = $Values<typeof InvitationPermissions>;

export type ImageInfo = {
  +name: string,
  +sizeDesc: Array<string>,
  +urls: Array<string>
};

export type Invitation = {
  +id: number,
  +code: string,
  +date: string,
  +production: {
    +id: number,
    +name: string,
    +permission: InvitationPermission,
    +poster?: ?ImageInfo,
    +team?: ?{
      +id: number,
      +name: string,
      +role?: string
    }
  },
  +status: InvitationStatus,
  +user: {
    +avatar: ?ImageInfo,
    +email: string,
    +firstName: string,
    +id: string,
    +lastName: string
  }
};

export type Team = {
  id: number,
  name: string,
  subdomain: string
};

export type State = {
  +productions: Array<Production>,
  +activeProductionID: ?number,
  +isFetching: boolean,
  +error: ?string,
  +invitations: {
    +list: Array<Invitation>,
    +isFetching: boolean,
    +error?: string
  },
  +newTeam?: {
    +id?: number,
    +name?: string,
    +isFetching?: boolean,
    +error?: string
  },
  +teams?: {
    [userId: string]: Team
  },
  +types: Array<ProductionType>
};

export const initialState: State = {
  productions: [],
  types: [],
  activeProductionID: undefined,
  isFetching: false,
  error: undefined,
  invitations: {
    list: [],
    isFetching: false
  }
};

/**
 * Reducer.
 */
export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
): State {
  switch (action.type) {
    case `${FETCH_PRODUCTION_TYPES}_PENDING`:
    case `${LEAVE_PRODUCTION}_PENDING`:
    case `${FETCH_PRODUCTIONS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_PRODUCTIONS}_FULFILLED`:
      return {
        ...state,
        productions: get(action, "payload.data.items"),
        isFetching: false,
        error: undefined
      };

    case `${FETCH_PRODUCTIONS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${SELECT_PRODUCTION}`:
      return {
        ...state,
        activeProductionID: get(action, "payload.productionId")
      };

    case `${FETCH_PRODUCTION_TYPES}_FULFILLED`: {
      const types = get(action, "payload.data");
      return {
        ...state,
        types,
        isFetching: false
      };
    }

    case `${FETCH_PRODUCTION_TYPES}_REJECTED`: {
      const error = get(action, "payload.message");
      return {
        ...state,
        error,
        isFetching: false
      };
    }

    case `${EDIT_PRODUCTION}_FULFILLED`:
    case `${FETCH_PRODUCTION_DETAILS}_FULFILLED`: {
      const id = get(action, "payload.data.id");
      const details = get(action, "payload.data");
      const productions = [...state.productions];
      const index = findIndex(productions, { id });
      productions.splice(index, 1, { ...productions[index], ...details });
      return {
        ...state,
        productions,
        isFetching: false,
        isSaving: false,
        isDeleting: false
      };
    }

    case `${FETCH_PRODUCTION_DETAILS}_REJECTED`: {
      const error = get(action, "payload.message");
      return {
        ...state,
        error,
        isFetching: false
      };
    }

    case `${EDIT_PRODUCTION}_PENDING`:
      return {
        ...state,
        isSaving: true
      };

    case `${EDIT_PRODUCTION}_REJECTED`: {
      const error = get(action, "payload.error");
      return {
        ...state,
        error,
        isSaving: false
      };
    }

    case `${DELETE_PRODUCTION}_PENDING`:
      return {
        ...state,
        isDeleting: true
      };

    case `${DELETE_PRODUCTION}_FULFILLED`:
      return {
        ...state,
        isDeleting: false
      };

    case `${DELETE_PRODUCTION}_REJECTED`: {
      const error = get(action, "payload.message");
      return {
        ...state,
        error,
        isDeleting: false
      };
    }

    case `${LEAVE_PRODUCTION}_FULFILLED`:
      return {
        ...state,
        isFetching: false
      };

    case `${LEAVE_PRODUCTION}_REJECTED`: {
      const error = get(action, "payload.message");
      return {
        ...state,
        error,
        isFetching: false
      };
    }

    case `${FETCH_INVITATIONS}_FULFILLED`: {
      return {
        ...state,
        invitations: {
          ...state.invitations,
          list: get(action, "payload.data.invitations", []),
          isFetching: false
        }
      };
    }

    case `${FETCH_INVITATIONS}_REJECTED`: {
      const error = get(action, "payload.message");
      return {
        ...state,
        error,
        isFetching: false
      };
    }

    case `${ACCEPT_INVITATION}_PENDING`: {
      const code = get(action, "meta.input.code", "");
      const invitations = [...state.invitations.list];
      const index = findIndex(invitations, { code });

      invitations.splice(index, 1, {
        ...invitations[index],
        status: InvitationStatuses.ACCEPTED
      });

      return {
        ...state,
        invitations: {
          ...state.invitations,
          list: invitations,
          isFetching: true
        }
      };
    }

    case `${ACCEPT_INVITATION}_FULFILLED`:
      return {
        ...state,
        invitations: {
          ...state.invitations,
          isFetching: false
        }
      };

    case `${ACCEPT_INVITATION}_REJECTED`: {
      const error = get(
        action,
        "payload.message",
        "An error occurred. Try again later."
      );
      const code = get(action, "meta.input.code", "");
      const invitations = [...state.invitations.list];
      const index = findIndex(invitations, { code });

      invitations.splice(index, 1, { ...invitations[index], accepted: false });

      return {
        ...state,
        invitations: {
          ...state.invitations,
          list: invitations,
          isFetching: false,
          error
        }
      };
    }

    case SET_NEW_TEAM_NAME:
      return {
        ...state,
        newTeam: {
          ...state.newTeam,
          name: action.payload
        }
      };

    case `${CREATE_NEW_TEAM}_PENDING`:
      return {
        ...state,
        newTeam: {
          ...state.newTeam,
          isFetching: true
        }
      };

    case `${CREATE_NEW_TEAM}_FULFILLED`: {
      const teamId = get(action, "payload.data.id").toString();
      const team = get(action, "meta.input");

      return {
        ...state,
        newTeam: {
          ...state.newTeam,
          isFetching: false
        },
        teams: {
          ...state.teams,
          [teamId]: {
            ...team,
            id: teamId
          }
        }
      };
    }

    case `${CREATE_NEW_TEAM}_REJECTED`: {
      const error = get(action, "payload.message");

      return {
        ...state,
        newTeam: {
          ...state.newTeam,
          isFetching: false,
          error
        }
      };
    }
    case `${FETCH_INVITATIONS}_PENDING`:
    case `${SEND_INVITATIONS}_PENDING`:
      return {
        ...state,
        invitations: {
          ...state.invitations,
          isFetching: true
        }
      };

    case `${SEND_INVITATIONS}_FULFILLED`: {
      return {
        ...state,
        invitations: {
          ...state.invitations,
          isFetching: false
        }
      };
    }

    case `${SEND_INVITATIONS}_REJECTED`: {
      const error = get(action, "payload.error");

      return {
        ...state,
        invitations: {
          ...state.invitations,
          isFetching: false,
          error
        }
      };
    }

    default:
      return state;
  }
}

/**
 * Action creators.
 */
export const fetchProductions = () => ({
  type: FETCH_PRODUCTIONS,
  payload: api.listProductions()
});

export const selectProduction = (productionId: number) => (
  dispatch: GlobalDispatch<*>
) => {
  sendProductionWidget(productionId);

  return dispatch({
    type: SELECT_PRODUCTION,
    payload: {
      productionId
    }
  });
};

export const getProductionTypes = () => ({
  type: FETCH_PRODUCTION_TYPES,
  payload: api.getProductionTypes()
});

export const getProductionDetails = (productionId: number) => ({
  type: FETCH_PRODUCTION_DETAILS,
  payload: api.getProductionDetails(productionId)
});

export const editProduction = (productionId: number, production: Object) => ({
  type: EDIT_PRODUCTION,
  payload: api.editProduction(productionId, production)
});

export const deleteProduction = (productionId: number) => ({
  type: DELETE_PRODUCTION,
  payload: api.deleteProduction(productionId)
});

export const leaveProduction = (productionId: number, userId: string) => ({
  type: LEAVE_PRODUCTION,
  payload: api.leaveProduction(productionId, userId)
});

export const getInvitations = (
  extraCodes?: Array<string>,
  offset?: number,
  statuses?: Array<InvitationStatus>
) => ({
  type: FETCH_INVITATIONS,
  payload: api.listInvitations({ extraCodes, offset, statuses }),
  meta: {
    input: { extraCodes, offset, statuses }
  }
});

export const acceptInvitation = (code: string) => ({
  type: ACCEPT_INVITATION,
  payload: api.acceptInvitation({ code }),
  meta: {
    input: { code }
  }
});

export const setNewTeamName = (teamName: string) => ({
  type: SET_NEW_TEAM_NAME,
  payload: teamName
});

export const createNewTeam = (name: string, subdomain?: string) => ({
  type: CREATE_NEW_TEAM,
  payload: api.createTeam({ name, subdomain }),
  meta: {
    input: { name, subdomain }
  }
});

export type NewProduction = {
  name: string,
  year: number,
  number: string,
  productionTypeId: number
};

export const createNewProduction = (
  teamId: number,
  name: string,
  year: number,
  number: string,
  productionTypeId: number
) => ({
  type: CREATE_NEW_PRODUCTION,
  payload: api.createProduction({
    teamId,
    name,
    year,
    number,
    productionTypeId
  }),
  meta: {
    input: { teamId, name, year, number, productionTypeId }
  }
});

export type SetProductionInput = {
  +productionId: number,
  +poster: {
    +blob: {
      +size: number,
      +type: string
    },
    +imgUrl: string
  }
};

export const setProductionPoster = ({
  productionId,
  poster: { blob, imgUrl }
}: SetProductionInput) => ({
  type: SET_PRODUCTION_POSTER,
  payload: api.setProductionPoster(productionId, blob),
  meta: {
    input: {
      productionId,
      imgUrl
    }
  }
});

export type InvitationToSend = {
  email: string,
  firstName: string,
  lastName: string
};

export const sendInvitations = (
  productionId: string,
  invitations: Array<InvitationToSend>
) => ({
  type: SEND_INVITATIONS,
  payload: api.sendInvitations({ productionId, invitations })
});
