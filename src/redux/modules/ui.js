// @flow
import { DISPLAY_ERROR } from "src/redux/middleware/errorDisplay";
// import Debug from 'debug'
// const log = Debug('my-app:redux:modules:ui')

// ACTION TYPES
export const CLOSE_SIDEBAR: "procliq-web-editor/ui/CLOSE_SIDEBAR" =
  "procliq-web-editor/ui/CLOSE_SIDEBAR";
export const OPEN_SIDEBAR: "procliq-web-editor/ui/OPEN_SIDEBAR" =
  "procliq-web-editor/ui/OPEN_SIDEBAR";

export const START_LOADING: "procliq-web-editor/ui/START_LOADING" =
  "procliq-web-editor/ui/START_LOADING";
export const STOP_LOADING: "procliq-web-editor/ui/STOP_LOADING" =
  "procliq-web-editor/ui/STOP_LOADING";

export const GO_TO: "procliq-web-editor/ui/GO_TO" =
  "procliq-web-editor/ui/GO_TO";

export const NEW_MESSAGES_WIDGET_NUMBER: "production-cliq-widget/channels/NEW_MESSAGES_WIDGET_NUMBER" =
  "production-cliq-widget/channels/NEW_MESSAGES_WIDGET_NUMBER";

export const SET_STRIPBOARD_SIDEBAR_MODE: "procliq-web-editor/ui/SET_STRIPBOARD_SIDEBAR_MODE" =
  "procliq-web-editor/ui/SET_STRIPBOARD_SIDEBAR_MODE";

// MODEL
export type State = {
  sidebarOpen: boolean,
  error: ?{ message: string },
  showLoading: boolean,
  productionMenuRoute: string,
  newMessagesWidget: number,
  stripboardSidebarMode: "none" | "details" | "search"
};

export const initialState: State = {
  sidebarOpen: false,
  error: null,
  // Manual option to show loading indicator if needed
  showLoading: false,
  productionMenuRoute: "",
  newMessagesWidget: 0,
  stripboardSidebarMode: "none"
};

// REDUCER
function reducer(state: State = initialState, action: GlobalFSA<*>) {
  switch (action.type) {
    case DISPLAY_ERROR:
      return {
        ...state,
        error: action.payload
      };

    case CLOSE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: false
      };

    case OPEN_SIDEBAR:
      return {
        ...state,
        sidebarOpen: true
      };

    case START_LOADING:
      return {
        ...state,
        showLoading: true
      };

    case STOP_LOADING:
      return {
        ...state,
        showLoading: false
      };
    case GO_TO:
      return {
        ...state,
        productionMenuRoute: action.payload
      };

    case NEW_MESSAGES_WIDGET_NUMBER:
      return {
        ...state,
        newMessagesWidget: action.payload
      };

    case SET_STRIPBOARD_SIDEBAR_MODE:
      return {
        ...state,
        stripboardSidebarMode: action.payload
      };

    default:
      return state;
  }
}

// ACTION CREATORS
// Use Flux Standard Action (FSA) notation
// https://github.com/acdlite/flux-standard-action
export const openSidebar = () => ({
  type: OPEN_SIDEBAR
});
export const closeSidebar = () => ({
  type: CLOSE_SIDEBAR
});

export const startLoading = () => ({
  type: START_LOADING
});

export const stopLoading = () => ({
  type: STOP_LOADING
});

export const goTo = (route: string) => ({
  type: GO_TO,
  payload: route
});

export const showError = (message: string) => ({
  type: DISPLAY_ERROR,
  payload: { message }
});

export const setStripboardSidebarMode = (
  mode: $PropertyType<State, "stripboardSidebarMode">
) => ({
  type: SET_STRIPBOARD_SIDEBAR_MODE,
  payload: mode
});

export default reducer;
