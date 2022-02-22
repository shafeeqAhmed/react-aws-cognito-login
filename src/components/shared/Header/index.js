// @flow
import { connect } from "react-redux";
import getCurrentUser from "src/redux/selectors/getCurrentUser";
import getCurrentProduction from "src/redux/selectors/getCurrentProduction";
import {
  openSidebar as openProductionMenu,
  closeSidebar as closeProductionMenu
} from "src/redux/modules/ui";
import Component from "./header";
import type { RootReducerState } from "src/redux/modules";
import type { UserProfile } from "src/redux/modules/users";
import type { Production } from "src/redux/modules/productions";

type StateProps = {
  +currentUser: ?UserProfile,
  +production: ?Production,
  +isProductionMenuOpen: boolean,
  +newMessagesWidget: number
};

type OwnProps = {
  +title: string
};

function mapStateToProps(state: RootReducerState, props: OwnProps): StateProps {
  const currentUser = getCurrentUser(state);
  const production = getCurrentProduction(state);
  const isProductionMenuOpen = state.ui.sidebarOpen;

  return {
    ...props,
    currentUser,
    production,
    isProductionMenuOpen,
    newMessagesWidget: state.ui.newMessagesWidget
  };
}

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  +openProductionMenu: typeof openProductionMenu,
  +closeProductionMenu: typeof closeProductionMenu
};

const mapDispatchToProps: DispatchProps = {
  openProductionMenu,
  closeProductionMenu
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
export type Props = OwnProps & StateProps & DispatchProps;
