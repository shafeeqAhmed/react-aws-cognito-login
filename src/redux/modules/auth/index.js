// @flow
import { CognitoUser as User } from "amazon-cognito-identity-js";
import { get } from "lodash";
import { Auth } from "aws-amplify";
import { fetchCurrentUser } from "src/redux/modules/users";
import { loginWalkie } from "src/helpers/widget";
import { setItem } from "src/helpers/storage";
import * as api from "./api";

export type { RegisterUserInput } from "./api";

/**
 * action types.
 */
export const LOGIN: "procliq-editor-web/auth/LOGIN" =
  "procliq-editor-web/auth/LOGIN";
export const LOGIN_PENDING: "procliq-editor-web/auth/LOGIN_PENDING" =
  "procliq-editor-web/auth/LOGIN_PENDING";
export const LOGIN_REJECTED: "procliq-editor-web/auth/LOGIN_REJECTED" =
  "procliq-editor-web/auth/LOGIN_REJECTED";
export const LOGOUT: "procliq-editor-web/auth/LOGOUT" =
  "procliq-editor-web/auth/LOGOUT";
export const STEP = "procliq-editor-web/auth/STEP";
export const CHANGE_COGNITO_STATE: "procliq-editor-web/auth/CHANGE_COGNITO_STATE" =
  "procliq-editor-web/auth/CHANGE_COGNITO_STATE";
export const VERIFY_SESSION: "procliq-editor-web/auth/VERIFY_SESSION" =
  "procliq-editor-web/auth/VERIFY_SESSION";
export const SET_TEMPORARY_USER: "procliq-editor-web/auth/SET_TEMPORARY_USER" =
  "procliq-editor-web/auth/SET_TEMPORARY_USER";
export const SAVE_USER_REGISTRATION: "procliq-editor-web/auth/SAVE_USER_REGISTRATION" =
  "procliq-editor-web/auth/SAVE_USER_REGISTRATION";
export const REGISTER_USER: "procliq-editor-web/auth/REGISTER_USER" =
  "procliq-editor-web/auth/REGISTER_USER";
export const ACCEPT_TOS: "procliq-editor-web/auth/ACCEPT_TOS" =
  "procliq-editor-web/auth/ACCEPT_TOS";
export const GET_SIGNUP_AVATAR: "procliq-editor-web/auth/GET_SIGNUP_AVATAR" =
  "procliq-editor-web/auth/GET_SIGNUP_AVATAR";

/**
 * State definition.
 */
export const CognitoStates = {
  signIn: "signIn",
  signUp: "signUp",
  confirmSignIn: "confirmSignIn",
  confirmSignUp: "confirmSignUp",
  forgotPassword: "forgotPassword",
  verifyContact: "verifyContact",
  signedIn: "signedIn"
};

export type CognitoState = $Keys<typeof CognitoStates>;

export const CognitoUser = User;

export type CognitoTemporaryUser = CognitoUser & {
  +challengeName?: string,
  +challengeParam?: {
    +requiredAttributes: Array<string>,
    +userAttributes: Object
  },
  +messageError?: string
};

export type State = {
  cognitoState: CognitoState,
  cognitoUser?: CognitoUser,
  isFetching: boolean,
  temporaryUser?: CognitoTemporaryUser,
  // $FlowFixMe
  +signUpAvatar?: string | ArrayBuffer,
  +messageError?: string,
  +registrationData?: api.RegisterUserInput,
  +signupJWT?: string
};

/**
 * initial state.
 */
export const initialState: State = {
  cognitoState: CognitoStates.signIn,
  isFetching: false
};

/**
 * reducer.
 */
export default function reducer(
  state: State = initialState,
  action: GlobalFSA<*>
) {
  switch (action.type) {
    case LOGIN_PENDING: {
      return {
        ...state,
        isFetching: true
      };
    }

    case LOGIN: {
      loginWalkie(get(action, "payload.authData"));
      return {
        ...state,
        messageError: null,
        isFetching: false,
        cognitoState: get(action, "payload.authState"),
        cognitoUser: get(action, "payload.authData")
      };
    }

    case LOGOUT:
      return initialState;

    case STEP:
      return {
        ...state,
        cognitoState: get(action, "payload.authState"),
        cognitoUser: get(action, "payload.authData")
      };

    case LOGIN_REJECTED: {
      const messageError = get(action, "payload.error.message");
      return {
        ...state,
        isFetching: false,
        messageError
      };
    }

    case CHANGE_COGNITO_STATE: {
      const cognitoState = get(action, "payload");

      setItem("cognitoState", cognitoState);

      return {
        ...state,
        cognitoState
      };
    }
    case `${VERIFY_SESSION}_PENDING`: {
      return {
        ...state,
        isFetching: true,
        cognitoState: CognitoStates.signIn
      };
    }

    case `${VERIFY_SESSION}_FULFILLED`: {
      return {
        ...state,
        isFetching: false,
        cognitoState: CognitoStates.signedIn,
        cognitoUser: action.payload
      };
    }

    case `${VERIFY_SESSION}_REJECTED`: {
      return {
        ...state,
        isFetching: false,
        cognitoState: CognitoStates.signIn
      };
    }

    case SET_TEMPORARY_USER:
      return {
        ...state,
        isFetching: false,
        messageError: null,
        temporaryUser: action.payload
      };

    case `${GET_SIGNUP_AVATAR}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${GET_SIGNUP_AVATAR}_FULFILLED`: {
      const avatar = get(action, "payload.data.data.dataUrl");

      return {
        ...state,
        isFetching: false,
        signUpAvatar: avatar
      };
    }

    case `${GET_SIGNUP_AVATAR}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        messageError: get(action, "payload.error.message")
      };

    case `${SAVE_USER_REGISTRATION}`:
      return {
        ...state,
        registrationData: action.payload
      };

    case `${REGISTER_USER}_PENDING`:
      return {
        ...state,
        isFetching: true
      };

    case `${REGISTER_USER}_FULFILLED`:
      return {
        ...state,
        isFetching: false,
        signupJWT: get(action, "payload.data.jwt", "")
      };

    case `${REGISTER_USER}_REJECTED`:
      return {
        ...state,
        isFetching: false,
        messageError: get(action, "payload.error.message")
      };

    default:
      return state;
  }
}

/**
 * action creators.
 */
export const login = (
  authState: CognitoState,
  authData?: CognitoUser
) => async (dispatch: GlobalDispatch<*>) => {
  await dispatch(fetchCurrentUser());
  return dispatch({
    type: LOGIN,
    payload: { authState, authData }
  });

  // await dispatch(fetchProductions());
};

export const loginFeching = () => ({
  type: LOGIN_PENDING
});

export const logout = () => ({
  type: LOGOUT
});

export const step = (authState: CognitoState, authData?: CognitoUser) => ({
  type: STEP,
  payload: { authState, authData }
});

export const loginError = (error: string) => ({
  type: LOGIN_REJECTED,
  payload: {
    error
  }
});

export const changeCognitoState = (state: string) => ({
  type: CHANGE_COGNITO_STATE,
  payload: state
});

export const verifySession = () => ({
  type: VERIFY_SESSION,
  payload: Auth.currentSession()
});

export const setTemporaryUser = (user: CognitoTemporaryUser) => ({
  type: SET_TEMPORARY_USER,
  payload: user
});

export const saveUserRegistration = (input: api.RegisterUserInput) => ({
  type: SAVE_USER_REGISTRATION,
  payload: input,
  meta: { input }
});

export const registerUser = (input: api.RegisterUserInput) => ({
  type: REGISTER_USER,
  payload: api.registerUser(input),
  meta: { input }
});

export const acceptTOS = (jwt: string) => ({
  type: ACCEPT_TOS,
  payload: api.acceptTOS({ jwt }),
  meta: { input: { jwt } }
});

export type GetSignUpAvatarInput = {
  provider: "facebook" | "google",
  userId: string,
  url: string
};

export const getSignUpAvatar = ({
  provider,
  userId,
  url
}: GetSignUpAvatarInput) => ({
  type: GET_SIGNUP_AVATAR,
  payload: api.getSignUpAvatar({ provider, userId, url })
});
