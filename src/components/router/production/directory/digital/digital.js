// @flow
import React, { PureComponent } from "react";
import { get } from "lodash";
import css from "./digital.style.css";
import Navbar from "src/components/shared/Navbar";
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import Toolbar from "../components/toolbar";
import DigitalRequirementDrawer from "./DigitalRequirementDrawer";
import Table from "./table";
import type { Props } from "./";

type State = {|
  newElementDrawerOpen: boolean
|};

export default class DigitalRequirement extends PureComponent<Props, State> {
  state: State = {
    newElementDrawerOpen: false
  };

  componentDidUpdate = (prev: Props) => {
    // temp workaround. need to set active team in production routes
    const { production: prevProd } = prev;
    const { production, setActiveTeam } = this.props;

    const teamId = get(production, "team.id");

    if (!prevProd || (!get(prevProd, "team.id") && teamId)) {
      setActiveTeam({ teamId });
    }
  };

  closeNewElementDrawer = () => {
    this.setState({
      newElementDrawerOpen: false
    });
  };

  onClickNew = () => {
    this.setState({
      newElementDrawerOpen: true
    });
  };

  render() {
    const { category } = this.props;
    const { newElementDrawerOpen } = this.state;

    return (
      <div className={css.digitalRequirement}>
        <Navbar active="directory" />

        <div className={css.content}>
          <Sidebar active={get(category, "id")} />

          <div className={css.main}>
            <Header category={category} />
            <Toolbar category={category} onClickNew={this.onClickNew} />
            <Table category={category} />
          </div>
        </div>

        <DigitalRequirementDrawer
          open={newElementDrawerOpen}
          onClose={this.closeNewElementDrawer}
        />
      </div>
    );
  }
}
