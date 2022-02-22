// @flow
import React, { PureComponent } from "react";
import renderRoutes from "src/helpers/router/renderRoutes";
import { times } from "lodash";
import rightBackground from "static/images/invitationsBackground.png";
import Layout from "src/components/layouts/onboarding";
import type { ReduxProps } from "./";
import css from "./newTeam.style.css";

type Props = ReduxProps & {};

const pages = {
  "/new-team/name": {
    title: "Name your Team",
    stepNumber: 0
  }
  // "/new-team/url": {
  //   title: "Customize your \nTeam URL",
  //   stepNumber: 1
  // }
};

export default class NewTeam extends PureComponent<Props> {
  getTitle = () => {
    const {
      location: { pathname }
    } = this.props;

    return pages[pathname] && pages[pathname].title;
  };

  renderPagination = () => {
    const {
      location: { pathname }
    } = this.props;

    const activeStep = pages[pathname] && pages[pathname].stepNumber;

    return times(4, index => (
      <div
        key={index}
        className={`${css.step} ${activeStep === index ? css.stepActive : ""}`}
      />
    ));
  };

  render() {
    const { route } = this.props;

    return (
      <Layout title={this.getTitle()} background={rightBackground}>
        {renderRoutes(route.routes)}
        {/* <div className={css.pagination}>{this.renderPagination()}</div> */}
      </Layout>
    );
  }
}
