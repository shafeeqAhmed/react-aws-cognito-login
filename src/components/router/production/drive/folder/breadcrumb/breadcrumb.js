// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Fragment, PureComponent } from "react";
import { Link } from "react-router-dom";
import BreadcrumbDividerIcon from "@material-ui/icons/ChevronRight";
import classNames from "classnames";
import type { Props } from "./";
import type { File } from "src/redux/modules/drive";
import css from "./breadcrumb.style.css";

export default class Breadcrumb extends PureComponent<Props> {
  renderProduction() {
    const { production, folders } = this.props;
    if (!production || !folders) return null;

    return (
      <div
        className={classNames({
          [css.production]: true,
          [css.subfolder]: !!folders.length
        })}
      >
        <Link className={css.link} to={`/${production.id}/drive`}>
          {production.name}
        </Link>
      </div>
    );
  }

  renderFolders() {
    const { folders } = this.props;
    if (!folders || !folders.length) return null;
    return folders.map((f, i) =>
      Breadcrumb.renderFolder(f, i !== folders.length - 1)
    );
  }

  static renderFolder(f: File, subfolder: boolean) {
    return (
      <Fragment key={f.id}>
        <div className={css.divider}>
          <BreadcrumbDividerIcon />
        </div>

        <div
          className={classNames({
            [css.folder]: true,
            [css.subfolder]: subfolder
          })}
        >
          <Link className={css.link} to={`/${f.productionId}/drive/${f.id}`}>
            {f.name}
          </Link>
        </div>
      </Fragment>
    );
  }

  render() {
    return (
      <div className={css.root}>
        {this.renderProduction()}
        {this.renderFolders()}
      </div>
    );
  }
}
