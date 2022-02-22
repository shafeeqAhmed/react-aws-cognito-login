// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { get } from "lodash";
import Button from "@material-ui/core/Button";
import FilesSectionIcon from "static/images/sectionIconFiles.svg";
import RecentSectionIcon from "static/images/sectionIconRecent.svg";
import FavoritesSectionIcon from "static/images/sectionIconFavorites.svg";
import TrashSectionIcon from "static/images/sectionIconTrash.svg";
import FilesSectionIconActive from "static/images/sectionIconFilesActive.svg";
import RecentSectionIconActive from "static/images/sectionIconRecentActive.svg";
import FavoritesSectionIconActive from "static/images/sectionIconFavoritesActive.svg";
import TrashSectionIconActive from "static/images/sectionIconTrashActive.svg";
import classNames from "classnames";
import { Sections } from "src/redux/modules/drive";
import css from "./navigator.style.css";
import type { Section } from "src/redux/modules/drive";

import type { Props } from "./";

export default class Navigator extends PureComponent<Props> {
  isActive(name: Section) {
    const folderId = get(this.props, "match.params.folderId", "");

    switch (name) {
      case Sections.FILES:
        return !folderId || !Object.values(Sections).includes(folderId);
      default:
        return folderId === name;
    }
  }

  handleClick = (e: Event, section: Section) => {
    e.preventDefault();
    if (this.isActive(section)) return false;

    const { history, match } = this.props;
    const { productionId } = match.params;
    const path =
      section === Sections.FILES
        ? `/${productionId}/drive`
        : `/${productionId}/drive/${section}`;

    history.push(path);
    return false;
  };

  //   className={classNames({
  //                           [css.button]: true,
  //                           [css.active]: this.isActive(Sections.FILES)
  // })}
  render() {
    return (
      <div className={css.navigator}>
        <div className={css.tools}>
          <div className={css.sideBarTools}>
            <Button
              classes={{
                root: css.button,
                label: css.titleText
              }}
              onClick={(e: Event) => this.handleClick(e, Sections.FILES)}
            >
              <img
                className={classNames({
                  [css.buttonIconImg]: true,
                  [css.active]: this.isActive(Sections.FILES),
                  [css.nonActive]: !this.isActive(Sections.FILES)
                })}
                alt="Files"
                src={
                  this.isActive(Sections.FILES)
                    ? FilesSectionIconActive
                    : FilesSectionIcon
                }
              />
              <span
                className={classNames({
                  [css.titleText]: true,
                  [css.active]: this.isActive(Sections.FILES),
                  [css.nonActive]: !this.isActive(Sections.FILES)
                })}
              >
                Files
              </span>
            </Button>

            <Button
              classes={{
                root: css.button,
                label: css.titleText
              }}
              onClick={(e: Event) => this.handleClick(e, Sections.RECENT)}
            >
              <img
                className={classNames({
                  [css.buttonIconImg]: true,
                  [css.active]: this.isActive(Sections.RECENT),
                  [css.nonActive]: !this.isActive(Sections.RECENT)
                })}
                alt="Recent"
                src={
                  this.isActive(Sections.RECENT)
                    ? RecentSectionIconActive
                    : RecentSectionIcon
                }
              />
              <span
                className={classNames({
                  [css.titleText]: true,
                  [css.active]: this.isActive(Sections.RECENT),
                  [css.nonActive]: !this.isActive(Sections.RECENT)
                })}
              >
                Recent
              </span>
            </Button>

            <Button
              classes={{
                root: css.button,
                label: css.titleText
              }}
              onClick={(e: Event) => this.handleClick(e, Sections.FAVORITES)}
            >
              <img
                className={classNames({
                  [css.buttonIconImg]: true,
                  [css.active]: this.isActive(Sections.FAVORITES),
                  [css.nonActive]: !this.isActive(Sections.FAVORITES)
                })}
                alt="Favorites"
                src={
                  this.isActive(Sections.FAVORITES)
                    ? FavoritesSectionIconActive
                    : FavoritesSectionIcon
                }
              />
              <span
                className={classNames({
                  [css.titleText]: true,
                  [css.active]: this.isActive(Sections.FAVORITES),
                  [css.nonActive]: !this.isActive(Sections.FAVORITES)
                })}
              >
                Favorites
              </span>
            </Button>

            <Button
              classes={{
                root: css.button,
                label: css.titleText
              }}
              onClick={(e: Event) => this.handleClick(e, Sections.TRASH)}
            >
              <img
                className={classNames({
                  [css.buttonIconImg]: true,
                  [css.active]: this.isActive(Sections.TRASH),
                  [css.nonActive]: !this.isActive(Sections.TRASH)
                })}
                alt="Trash"
                src={
                  this.isActive(Sections.TRASH)
                    ? TrashSectionIconActive
                    : TrashSectionIcon
                }
              />
              <span
                className={classNames({
                  [css.titleText]: true,
                  [css.active]: this.isActive(Sections.TRASH),
                  [css.nonActive]: !this.isActive(Sections.TRASH)
                })}
              >
                Trash
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
