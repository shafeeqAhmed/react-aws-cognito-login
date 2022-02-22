// @flow
import React, { PureComponent } from "react";
import css from "./productionMenu.style.css";
import Header from "./header";
import Home from "./home";
import SelectProduction from "./selectProduction";
import Settings from "./settings";
import {
  HOME,
  SETTINGS,
  SELECT_PRODUCTION,
  MANAGE_ADMINISTRATORS,
  ADD_NEW_ADMIN
} from "./routes";
import ManageAdministrators from "./manageAdministrators";
import AddNewAdmin from "./manageAdministrators/addNewAdmin";
import type { ReduxProps } from "./";

type Props = ReduxProps & {
  history: Object
};

export default class ProductionMenu extends PureComponent<Props> {
  componentDidMount() {
    this.props.goTo(HOME);
  }

  render() {
    const content = () => {
      switch (this.props.productionMenuRoute) {
        case HOME:
          return <Home history={this.props.history} />;

        case SELECT_PRODUCTION:
          return <SelectProduction />;

        case SETTINGS:
          return <Settings history={this.props.history} />;

        case MANAGE_ADMINISTRATORS:
          return <ManageAdministrators />;

        case ADD_NEW_ADMIN:
          return <AddNewAdmin />;

        default:
          return <Home />;
      }
    };

    return (
      <div className={css.productionMenu}>
        <Header />
        <div className={css.content}>{content()}</div>
      </div>
    );
  }
}
