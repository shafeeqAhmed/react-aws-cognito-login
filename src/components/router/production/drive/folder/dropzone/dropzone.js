// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import cloudIconLarge from "static/images/cloud.svg";
import arrowUp from "static/images/up-arrow.svg";
import BreadcrumbDividerIcon from "@material-ui/icons/Cloud";
import css from "./dropzone.style.css";
import type { Props } from "./";

export default class Dropzone extends PureComponent<Props> {
  render() {
    const { connectDropTarget, children, canDrop } = this.props;

    return connectDropTarget(
      <div className={css.root}>
        {children}
        {canDrop && (
          <div className={css.overlay}>
            <div className={css.cloudContainer}>
              <img className={css.cloud} src={cloudIconLarge} alt="Cloud" />
              <img className={css.arrowUp} src={arrowUp} alt="Arrow" />
            </div>
            <div className={css.dropFiles}>
              <div className={css.title}>Drop files to upload them to:</div>
              <div className={css.folderContainer}>
                <BreadcrumbDividerIcon className={css.cloudIcon} />
                <div className={css.folder}>Files</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
