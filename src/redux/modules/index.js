// @flow
import { combineReducers } from "redux";
import { reducer as form } from "redux-form";

/**
 * State definitions.
 */
import type { EnvState } from "config/env";
import type { RequestState } from "src/redux/modules/request";
import type { InitState } from "src/redux/modules/init";
import type { State as UIState } from "src/redux/modules/ui";
import type { State as AuthState } from "src/redux/modules/auth";
import type { State as ScreenplayState } from "src/redux/modules/screenplay";
import type { State as TeamsState } from "src/redux/modules/teams";
import type { State as ProductionsState } from "src/redux/modules/productions";
import type { State as DriveState } from "src/redux/modules/drive";
import type { State as UsersState } from "src/redux/modules/users";
import type { State as CommentsState } from "src/redux/modules/comments";
import type { State as UnitsState } from "src/redux/modules/units";
import type { State as ScenesState } from "src/redux/modules/scenes";
import type { ScheduleReducerState } from "src/redux/modules/schedule";
import type { ShootingReducerState } from "src/redux/modules/shooting";
import type { State as GatekeeperState } from "src/redux/modules/gatekeeper";
import type { State as CategoriesState } from "src/redux/modules/categories";
import type { State as ElementsState } from "src/redux/modules/elements";
import type { State as ShotsState } from "src/redux/modules/shots";
import type { State as ColorsState } from "src/redux/modules/colors";
import type { State as WeatherState } from "src/redux/modules/weather";
import type { State as SoundsState } from "src/redux/modules/sounds";
import type { State as TagsState } from "src/redux/modules/tags";

/**
 * Reducers
 */
import env from "src/redux/modules/env";
import request from "src/redux/modules/request";
import init from "src/redux/modules/init";
import ui from "src/redux/modules/ui";
import auth from "src/redux/modules/auth";
import screenplay from "src/redux/modules/screenplay";
import teams from "src/redux/modules/teams";
import productions from "src/redux/modules/productions";
import drive from "src/redux/modules/drive";
import users from "src/redux/modules/users";
import comments from "src/redux/modules/comments";
import units from "src/redux/modules/units";
import scenes from "src/redux/modules/scenes";
import schedule from "src/redux/modules/schedule";
import shooting from "src/redux/modules/shooting";
import gatekeeper from "src/redux/modules/gatekeeper";
import categories from "src/redux/modules/categories";
import elements from "src/redux/modules/elements";
import shots from "src/redux/modules/shots";
import colors from "src/redux/modules/colors";
import weather from "src/redux/modules/weather";
import sounds from "src/redux/modules/sounds";
import tags from "src/redux/modules/tags";

export type RootReducerState = {|
  // Provides access to the runtime env vars sent from the server
  // Mirrors config/env. May not be needed.
  +env: EnvState,
  // Provides access to any exposed request headers sent to the web server
  // Currently only the userAgent header is exposed in here
  +request: RequestState,
  // Can be used for any initialization state management
  // i.e. if we ever need to show a loading splash screen until all images are
  // loaded, etc.
  +init: InitState,
  // Contains any global graphical UI state
  // i.e. globally positioned loading indicator, whether a primary
  // sidebar/drawer is open or closed that may affect the other views on the
  // page (maybe they need to move over, not scroll, etc.), etc.
  +ui: UIState,
  // Used by redux-form to store all form states
  +form: Object,

  // APPLICATION STATES
  +auth: AuthState,
  +teams: TeamsState,
  +productions: ProductionsState,
  +screenplay: ScreenplayState,
  +drive: DriveState,
  +users: UsersState,
  +comments: CommentsState,
  +units: UnitsState,
  +scenes: ScenesState,
  +schedule: ScheduleReducerState,
  +shooting: ShootingReducerState,
  +gatekeeper: GatekeeperState,
  +categories: CategoriesState,
  +elements: ElementsState,
  +shots: ShotsState,
  +colors: ColorsState,
  +weather: WeatherState,
  +sounds: SoundsState,
  +tags: TagsState
|};

const rootReducer = combineReducers({
  env,
  request,
  init,
  ui,
  form,

  auth,
  teams,
  productions,
  screenplay,
  drive,
  users,
  comments,
  units,
  scenes,
  schedule,
  shooting,
  gatekeeper,
  categories,
  elements,
  shots,
  colors,
  weather,
  sounds,
  tags
});

export default rootReducer;
