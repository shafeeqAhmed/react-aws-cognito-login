/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React, { PureComponent } from "react";
import IconButton from "@material-ui/core/IconButton";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Divider from "@material-ui/core/Divider";
import css from "./sidebar.styles.css";

export default class Sidebar extends PureComponent<{}> {
  render() {
    return (
      <div className={css.leftSidebarArea}>
        <div className={css.teamDatabaseSectionTitle}>
          <div className={css.teamDatabaseTitles}>
            <span className={css.teamDatabaseTitle}>Team Database</span>
            <span className={css.teamDatabaseSubtitle}>Sound Library</span>
          </div>
          <IconButton
            classes={{
              root: css.teamDatabaseTitleMenuButton
            }}
          >
            <ChevronRight
              classes={{ root: css.teamDatabaseTitleMenuButtonIcon }}
            />
          </IconButton>
        </div>

        <Divider
          variant="middle"
          classes={{
            root: css.divider
          }}
        />

        <div className={css.segmentTable}>
          <div className={css.segment}>
            <div className={css.segmentLeft}>All sounds</div>
            <div className={css.segmentRight}>{"  "}</div>
          </div>
        </div>
      </div>
    );
  }
}
