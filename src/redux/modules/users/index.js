// @flow
import { get, omit, uniqBy } from "lodash";
import * as api from "./api";
import { mapApiToState } from "src/helpers/mapUserDetails";

export * from "./helpers";
export * from "./selectors";

/**
 * Action types.
 */
export const FETCH_USER: "procliq-web-editor/users/FETCH_USER" =
  "procliq-web-editor/users/FETCH_USER";
export const FETCH_CURRENT_USER: "procliq-web-editor/users/FETCH_CURRENT_USER" =
  "procliq-web-editor/users/FETCH_CURRENT_USER";
export const FETCH_USER_ROLES: "procliq-web-editor/users/FETCH_USER_ROLES" =
  "procliq-web-editor/users/FETCH_USER_ROLES";
export const FETCH_USER_TAGS: "procliq-web-editor/users/FETCH_USER_TAGS" =
  "procliq-web-editor/users/FETCH_USER_TAGS";
export const SAVE_USER_INFO: "procliq-web-editor/users/SAVE_USER_INFO" =
  "procliq-web-editor/users/SAVE_USER_INFO";
export const SAVE_USER_DETAILS: "procliq-web-editor/users/SAVE_USER_DETAILS" =
  "procliq-web-editor/users/SAVE_USER_DETAILS";
export const FETCH_USERS: "procliq-web-editor/users/FETCH_USERS" =
  "procliq-web-editor/users/FETCH_USERS";
export const SELECT_USER: "procliq-web-editor/users/SELECT_USER" =
  "procliq-web-editor/users/SELECT_USER";
export const NEW_ADMINISTRATORS: "procliq-web-editor/users/NEW_ADMINISTRATORS" =
  "procliq-web-editor/users/NEW_ADMINISTRATORS";
export const SAVE_USER_AVATAR: "procliq-web-editor/users/SAVE_USER_AVATAR" =
  "procliq-web-editor/users/SAVE_USER_AVATAR";
export const FETCH_CONTACTS: "procliq-web-editor/users/FETCH_CONTACTS" =
  "procliq-web-editor/users/FETCH_CONTACTS";
export const SEARCH: "procliq-web-editor/users/SEARCH" =
  "procliq-web-editor/users/SEARCH";
export const FETCH_TAG: "procliq-web-editor/users/FETCH_TAG" =
  "procliq-web-editor/users/FETCH_TAG";
export const FETCH_DEPARTMENT: "procliq-web-editor/users/FETCH_DEPARTMENT" =
  "procliq-web-editor/users/FETCH_DEPARTMENT";

/**
 * State definition.
 */
export type ImageInfo = {
  // +baseUrl: string,
  // +name: string,
  // +sizes: Array<string>
  //
  +urls: Array<string>,
  +sizeDesc: Array<string>,
  +name: string
};

export const UserRoles = {
  PLACEHOLDER: ("PLACEHOLDER": "PLACEHOLDER"),
  NOT_VERIFIED: ("NOT_VERIFIED": "NOT_VERIFIED"),
  USER: ("USER": "USER"),
  APP_ADMIN: ("APP_ADMIN": "APP_ADMIN"),
  SYSTEM: ("SYSTEM": "SYSTEM")
};

export type UserRole = $Values<typeof UserRoles>;

export const DepartmentTypes = {
  CAST: ("CAST": "CAST"),
  CREW: ("CREW": "CREW"),
  EXTRAS: ("EXTRAS": "EXTRAS")
};

export type DepartmentType = $Values<typeof DepartmentTypes>;

export type Department = {
  +id: number,
  +name: string,
  +type: DepartmentType
};

export type Role = {
  +id: number,
  +name: string,
  +department: Department
};

export type UserTag = {
  +id: number,
  +name: string
};

export type UserTags = {
  nextOffset: ?number,
  items: ?Array<UserTag>
};

export type UserProfile = {
  +id: string,
  +avatar: ?ImageInfo,
  +creditName: ?string,
  +email: ?string,
  +firstName: ?string,
  +lastName: ?string,
  +mention: string, // TODO: remove mention
  +name: string, // TODO: remove name
  +role: UserRole,
  +tags: ?UserTags,
  +roles: ?Array<Role>,
  +tosAccepted: boolean,
  +color: string,
  +vlUserId: ?string,
  +permission?: ?string
};

export type UsersList = {
  [userId: string]: UserProfile
};

export type Contact = {
  +id: string,
  +firstName: string,
  +lastName: string,
  +email: string,
  +avatar: ?ImageInfo
};

export type ContactsList = {
  [contactId: string]: Contact
};

export type SearchResults = {
  +users: Array<string>,
  +departments: Array<number>,
  +tags: Array<number>
};

export type Search = {
  +query: string,
  +isSearching: boolean,
  +error: ?string,
  +results: SearchResults
};

export type State = {|
  +users: UsersList,
  +currentUserId: ?string,
  +isFetching: boolean,
  +error: ?string,
  +isSaving: boolean,
  +nextOffset: ?number,
  +selectedUser: ?UserProfile,
  +invitePeople: {
    +contacts: ContactsList,
    +isFetching: boolean,
    +error?: string
  },
  +tags: { [id: number]: UserTag },
  +departments: { [id: number]: Department },
  +search: ?Search
|};

export const initialState: State = {
  users: {},
  nextOffset: undefined,
  currentUserId: undefined,
  isFetching: false,
  error: undefined,
  isSaving: false,
  selectedUser: undefined,
  invitePeople: {
    contacts: {},
    isFetching: false
  },
  tags: {},
  departments: {},
  search: {
    query: "",
    isSearching: false,
    error: undefined,
    results: {
      departments: [],
      users: [],
      tags: []
    }
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
    case `${FETCH_USER}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_USER}_FULFILLED`: {
      const user = get(action, "payload.data.user");

      const users = { ...state.users };
      users[user.id] = { ...state.users[user.id], ...user };

      const departments = { ...state.departments };
      (user.roles || []).forEach(r => {
        const dep = get(r, "department");
        if (dep) {
          departments[dep.id] = dep;
        }
      });

      const tags = { ...state.tags };
      get(user, "tags.items", []).forEach(t => {
        tags[t.id] = t;
      });

      return {
        ...state,
        users,
        departments,
        tags,
        isFetching: false,
        error: undefined
      };
    }

    case `${FETCH_USER}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${FETCH_TAG}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_TAG}_FULFILLED`: {
      const tag = get(action, "payload.data.tag");
      const tags = { ...state.tags };

      if (tag) {
        tags[tag.id] = tag;
      }

      return {
        ...state,
        tags,
        isFetching: false
      };
    }

    case `${FETCH_TAG}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${FETCH_DEPARTMENT}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_DEPARTMENT}_FULFILLED`: {
      const department = get(action, "payload.data.department");
      const departments = { ...state.departments };

      if (department) {
        departments[department.id] = department;
      }

      return {
        ...state,
        departments,
        isFetching: false
      };
    }

    case `${FETCH_DEPARTMENT}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${FETCH_CURRENT_USER}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_CURRENT_USER}_FULFILLED`: {
      const user = get(action, "payload.data.user");
      const details = mapApiToState(user.details);

      const users = { ...state.users };
      users[user.id] = {
        ...state.users[user.id],
        ...omit(user, ["tags", "roles"]),
        ...details
      };

      const departments = { ...state.departments };
      (user.roles || []).forEach(r => {
        const dep = get(r, "department");
        if (dep) {
          departments[dep.id] = dep;
        }
      });

      const tags = { ...state.tags };
      get(user, "tags.items", []).forEach(t => {
        tags[t.id] = t;
      });

      return {
        ...state,
        users,
        departments,
        tags,
        currentUserId: user.id,
        isFetching: false,
        error: undefined
      };
    }

    case `${FETCH_CURRENT_USER}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        currentUserId: undefined,
        error: action.payload
      };

    case `${FETCH_USER_ROLES}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_USER_ROLES}_FULFILLED`: {
      const roles = get(action, "payload.data", []);
      const userId = get(state, "currentUserId");

      const users = { ...state.users };
      users[userId] = {
        ...users[userId],
        roles
      };

      const departments = { ...state.departments };
      roles.forEach(r => {
        const dep = get(r, "department");
        if (dep) {
          departments[dep.id] = dep;
        }
      });

      return {
        ...state,
        users,
        departments,
        isFetching: false,
        error: undefined
      };
    }

    case `${FETCH_USER_ROLES}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${FETCH_USER_TAGS}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${FETCH_USER_TAGS}_FULFILLED`: {
      const userTags = get(action, "payload.data.items");
      const nextOffset = get(action, "payload.data.nextOffset", 0);
      const userId = get(state, "currentUserId");

      const users = { ...state.users };
      users[userId] = {
        ...users[userId],
        tags: {
          nextOffset,
          items: uniqBy(
            get(users, `${userId}.tags.items`, []).concat(userTags),
            t => t.id
          )
        }
      };

      const tags = { ...state.tags };
      userTags.forEach(t => {
        tags[t.id] = t;
      });

      return {
        ...state,
        users,
        tags,
        isFetching: false,
        error: undefined
      };
    }

    case `${FETCH_USER_TAGS}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        error: action.payload
      };

    case `${SAVE_USER_DETAILS}_PENDING`:
    case `${SAVE_USER_INFO}_PENDING`:
      return {
        ...state,
        isSaving: true
      };

    case `${SAVE_USER_INFO}_FULFILLED`: {
      const profile = get(action, "payload.data");
      const userId = get(state, "currentUserId");

      return {
        ...state,
        isSaving: false,
        users: {
          ...state.users,
          [userId]: {
            ...state.users[userId],
            profile
          }
        }
      };
    }

    case `${SAVE_USER_DETAILS}_REJECTED`:
    case `${SAVE_USER_INFO}_REJECTED`:
      return {
        ...state,
        isSaving: false,
        error: action.payload
      };

    case `${FETCH_USERS}_PENDING`: {
      return {
        ...state,
        isFetching: true
      };
    }

    case `${FETCH_USERS}_FULFILLED`: {
      const users = get(action, "payload.data.items");
      const nextOffset = get(action, "payload.data.nextOffset", []);

      const newUsers = {};

      users.forEach(user => {
        newUsers[user.id] = {
          ...state.users[user.id],
          ...user,
          ...action.meta
        };
      });

      return {
        ...state,
        isFetching: false,
        users: {
          ...state.users,
          ...newUsers
        },
        nextOffset
      };
    }

    case `${FETCH_USERS}_REJECTED`: {
      return {
        ...state,
        isFetching: false
      };
    }
    case `${NEW_ADMINISTRATORS}_PENDING`: {
      const userIds = get(action, "payload.userIds");
      const permission = get(action, "payload.permission");

      const newUsers = {
        ...state.users
      };

      userIds.forEach(userId => {
        newUsers[userId].permission = permission;
      });

      return {
        ...state,
        isFetching: true,
        users: newUsers
      };
    }
    case `${NEW_ADMINISTRATORS}_FULFILLED`: {
      return {
        ...state,
        isFetching: false
      };
    }
    case `${NEW_ADMINISTRATORS}_REJECTED`: {
      const error = get(action, "payload.error");
      return {
        ...state,
        isFetching: false,
        error
      };
    }

    case SELECT_USER: {
      const selectedUser = get(action, "payload.user");
      return {
        ...state,
        selectedUser
      };
    }

    case `${SAVE_USER_AVATAR}_PENDING`:
      return {
        ...state,
        isSaving: true
      };

    case `${SAVE_USER_AVATAR}_FULFILLED`: {
      const userId = get(state, "currentUserId");
      return {
        ...state,
        isSaving: false,
        users: {
          ...state.users,
          [userId]: {
            ...state.users[userId],
            profile: {
              ...state.users[userId],
              avatar: {
                name: action.payload ? action.payload.name : "",
                sizes: [action.payload ? action.payload.imgUrl : ""],
                baseUrl: ""
              }
            }
          }
        }
      };
    }

    case `${SAVE_USER_AVATAR}_REJECTED`:
      return {
        ...state,
        isSaving: false,
        error: action.payload ? action.payload.error : ""
      };

    case `${FETCH_CONTACTS}_PENDING`:
      return {
        ...state,
        invitePeople: {
          ...state.invitePeople,
          isFetching: true
        }
      };
    case `${FETCH_CONTACTS}_FULFILLED`: {
      const contacts = get(action, "payload.data.data");

      return {
        ...state,
        invitePeople: {
          ...state.invitePeople,
          isFetching: false,
          contacts
        }
      };
    }
    case `${FETCH_CONTACTS}_REJECTED`: {
      const error = get(action, "payload.error");

      return {
        ...state,
        invitePeople: {
          ...state.invitePeople,
          isFetching: false,
          error
        }
      };
    }

    case `${SEARCH}_PENDING`: {
      const query = get(action, "meta.input.query", "");

      if (!query) {
        return {
          ...state,
          search: {
            ...state.search,
            query,
            isSearching: false,
            results: { users: [], tags: [], departments: [] },
            error: undefined
          }
        };
      }

      let results = {
        ...get(state, "search.results", {
          users: [],
          tags: [],
          departments: []
        })
      };

      if (query === get(state, "search.query", "")) {
        results = {
          users: [],
          tags: [],
          departments: []
        };
      }

      return {
        ...state,
        search: {
          ...state.search,
          query,
          results,
          isSearching: true,
          error: undefined
        }
      };
    }

    case `${SEARCH}_FULFILLED`: {
      const results = {
        users: get(action, "payload.data.users", []),
        tags: get(action, "payload.data.tags", []),
        departments: get(action, "payload.data.departments", [])
      };

      const users = { ...state.users };
      results.users.forEach(u => (users[u.id] = u));

      const tags = { ...state.tags };
      results.tags.forEach(t => (tags[t.id] = t));

      const departments = { ...state.departments };
      results.departments.forEach(t => (departments[t.id] = t));

      let search = { ...state.search };
      if (get(action, "meta.input.query", "") === search.query) {
        search = {
          ...search,
          isSearching: !!search.query,
          results: {
            users: results.users.map(t => t.id),
            departments: results.departments.map(t => t.id),
            tags: results.tags.map(t => t.id)
          },
          error: undefined
        };
      }

      return {
        ...state,
        users,
        tags,
        departments,
        search
      };
    }

    case `${SEARCH}_REJECTED`:
      return {
        ...state,
        search: {
          ...state.search,
          isSearching: false,
          error: get(action, "payload", "An error occurred. Try again.")
        }
      };

    default:
      return state;
  }
}

/**
 * Action creators.
 */
export const fetchUser = (id?: string) => ({
  type: FETCH_USER,
  payload: api.getUserInfo({ id })
});

export const fetchCurrentUser = () => ({
  type: FETCH_CURRENT_USER,
  payload: api.getUserInfo()
});

export const fetchUserRoles = (productionId: number) => ({
  type: FETCH_USER_ROLES,
  payload: api.getUserRoles(productionId)
});

export const fetchUserTags = (productionId: number) => ({
  type: FETCH_USER_TAGS,
  payload: api.getUserTags(productionId)
});

export const saveUserInfo = (userId: string, info: Object) => (dispatch: any) =>
  dispatch({
    type: SAVE_USER_INFO,
    payload: api.saveUser(userId, info)
  });

export const saveUserDetails = (userId: string, details: Array<any>) => (
  dispatch: any
) =>
  dispatch({
    type: SAVE_USER_DETAILS,
    payload: api.saveUserDetails(userId, details)
  });

export const getUsers = (productionId: number, filter: Object) => ({
  type: FETCH_USERS,
  payload: api.getUsers(productionId, filter),
  meta: filter
});

export const selectUser = (user: Object) => ({
  type: SELECT_USER,
  payload: {
    user
  }
});

export const saveUserAvatar = (avatar: Object, imgUrl: string) => (
  dispatch: Dispatch<*>
) => {
  dispatch({ type: `${SAVE_USER_AVATAR}_PENDING` });

  api
    .saveUserAvatar(avatar)
    .then(({ name }) => {
      dispatch({
        type: `${SAVE_USER_AVATAR}_FULFILLED`,
        payload: {
          imgUrl,
          name
        }
      });
    })
    .catch(error => {
      dispatch({
        type: `${SAVE_USER_AVATAR}_REJECTED`,
        payload: {
          error
        }
      });
    });
};

export const updatePermission = (
  productionId: number,
  userIds: Array<string>,
  permission: string
) => (dispatch: GlobalDispatch<*>) => {
  dispatch({
    type: `${NEW_ADMINISTRATORS}_PENDING`,
    payload: {
      userIds,
      permission
    }
  });

  const promises = [];

  userIds.forEach(id => {
    promises.push(api.addNewAdministrators(productionId, id, permission));
  });

  Promise.all(promises)
    .then(() => {
      dispatch({
        type: `${NEW_ADMINISTRATORS}_FULFILLED`
      });
      dispatch(getUsers(productionId, { permission: "ADMIN" }));
    })
    .catch(error => {
      dispatch({
        type: `${NEW_ADMINISTRATORS}_REJECTED`,
        payload: {
          error
        }
      });
    });
};

export const getContacts = () => ({
  type: FETCH_CONTACTS,
  payload: api.getContacts()
});

export const search = (
  productionId: number,
  query: string,
  type?: Array<"USER" | "TAG" | "DEPARTMENT"> = ["USER", "TAG", "DEPARTMENT"]
) => ({
  type: SEARCH,
  payload: api.search({ productionId, query, type }),
  meta: {
    input: { productionId, query, type }
  }
});

export const fetchTag = (productionId: number, tagId: number) => ({
  type: FETCH_TAG,
  payload: api.getTagById({ productionId, tagId }),
  meta: {
    input: { productionId, tagId }
  }
});

export const fetchDepartment = (
  productionId: number,
  departmentId: number
) => ({
  type: FETCH_DEPARTMENT,
  payload: api.getDepartmentById({ productionId, departmentId }),
  meta: {
    input: { productionId, departmentId }
  }
});
