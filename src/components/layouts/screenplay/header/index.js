// @flow
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router";
import { get } from "lodash";
import Header from "./header";
import listScreenplayUsers from "src/redux/selectors/listScreenplayUsers";
import getScreenplayBreadcrumbs from "src/redux/selectors/getScreenplayBreadcrumbs";
import { isCurrentUserFavorite } from "src/redux/modules/drive/selectors";
import getCurrentUser from "src/redux/selectors/getCurrentUser";
import { openSidebar, closeSidebar } from "src/redux/modules/ui";
import { getUsers } from "src/redux/modules/users/";
import { toggleFavorite } from "src/redux/modules/drive";
import type { RootReducerState } from "src/redux/modules";
import type { Match, Route } from "src/helpers/router/route";
import type { UserProfile } from "src/redux/modules/users";
import type { ScreenplayUser, Metadata } from "src/redux/modules/screenplay";
import type { Breadcrumbs } from "src/redux/selectors/getScreenplayBreadcrumbs";

type RouterProps = {
  +route: Route,
  +match: Match<{
    productionId: string,
    folderId?: string,
    screenplayId?: string
  }>,
  +location: Location
};
/**
 * StateProps provide a read-only view of the state.
 */
type StateProps = {
  +users: Array<ScreenplayUser & UserProfile>,
  +breadcrumbs: ?Breadcrumbs,
  sidebarOpen: boolean,
  +currentUser: ?UserProfile,
  +isFavorite: boolean,
  +screenplay: Metadata
};

function mapStateToProps(
  state: RootReducerState,
  ownProps: RouterProps
): StateProps {
  const users = listScreenplayUsers(state);
  const breadcrumbs = getScreenplayBreadcrumbs(state);
  const currentUser = getCurrentUser(state);
  const isFavorite = isCurrentUserFavorite(
    state,
    ownProps.match.params.screenplayId
  );
  const screenplay = get(state, "screenplay.screenplay.metadata");

  return {
    users,
    sidebarOpen: state.ui.sidebarOpen,
    screenplay,
    breadcrumbs,
    currentUser,
    isFavorite
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +openSidebar: Function,
  +closeSidebar: Function,
  +getUsers: Function,
  +toggleFavorite: typeof toggleFavorite
};
const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      openSidebar,
      closeSidebar,
      getUsers,
      toggleFavorite
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
export type ReduxProps = RouterProps & StateProps & DispatchProps;
