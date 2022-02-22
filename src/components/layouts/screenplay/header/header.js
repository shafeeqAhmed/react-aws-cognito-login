// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent, Fragment } from "react";
import { get } from "lodash";
import imgLogo from "static/images/newLogo.svg";
import { IntercomAPI } from "react-intercom";
import vars from "config/variables";
import { Link } from "react-router-dom";
import ButtonBase from "@material-ui/core/ButtonBase";
import UnfavoritedIcon from "@material-ui/icons/StarBorder";
import FavoritedIcon from "@material-ui/icons/Star";
import MoreVerticalIcon from "@material-ui/icons/MoreVert";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import ManageCollabIcon from "static/images/contextMenuManageCollabIcon.svg";
import ShareLinkIcon from "static/images/contextMenuShareLinkIcon.svg";
import MoveIcon from "static/images/contextMenuMoveIcon.svg";
import MarkAsFavoriteIcon from "static/images/contextMenuMarkAsFavoriteIcon.svg";
import RenameIcon from "static/images/contextMenuRenameIcon.svg";
import DownloadIcon from "static/images/contextMenuDownloadIcon.svg";
import DuplicateIcon from "static/images/contextMenuDuplicateIcon.svg";
import TrashIcon from "static/images/contextMenuTrashIcon.svg";
import UserAvatar from "src/components/shared/UserAvatar";
import imgQuestion from "static/images/question.png";
import imgFolderGreywithArrow from "static/images/folderGrey.png";
import css from "./header.style.css";
import type { ReduxProps } from "./";

type State = {
  showContextualMenu: boolean
};

export default class Header extends PureComponent<ReduxProps, State> {
  contextMenuRef: ?HTMLElement = null;
  arrowRef: ?HTMLElement = null;

  state = {
    showContextualMenu: false
  };

  componentDidMount() {
    const productionId = get(this.props, "match.params.productionId", "");
    this.props.getUsers(productionId);
  }

  toggleSidebar = () => {
    const { sidebarOpen, closeSidebar, openSidebar } = this.props;
    if (sidebarOpen) return closeSidebar();
    return openSidebar();
  };

  handleToggleContextMenu = () => {
    this.setState({
      showContextualMenu: !this.state.showContextualMenu
    });
  };

  toggleFavorite = (favorite: boolean) => {
    const { currentUser, toggleFavorite } = this.props;
    const productionId = get(this.props, "match.params.productionId");
    const screenplay = get(this.props, "screenplay");

    if (!productionId || !currentUser) return;

    toggleFavorite(productionId, screenplay.fileId, favorite, currentUser.id);
  };

  onClickHelpAndFeedback = () => {
    IntercomAPI("show");
  };

  render() {
    const { breadcrumbs, isFavorite } = this.props;
    const { showContextualMenu } = this.state;

    return (
      <header className={css.header}>
        <div className={css.iconToolsContainer}>
          <button className={css.buttonLogo} onClick={this.toggleSidebar}>
            <img alt="" className={css.imgLogo} src={imgLogo} />
          </button>
          {breadcrumbs && (
            <div className={css.headerToolsContainer}>
              <div className={css.iconWithTexContainer}>
                <Link
                  className={css.link}
                  to={`/${breadcrumbs.production.id}/drive`}
                >
                  <div className={css.textTitle}>
                    {breadcrumbs.production.name} Files
                  </div>
                  <i className={`material-icons ${css.imgArrow}`}>
                    keyboard_arrow_right
                  </i>
                </Link>
              </div>
              {breadcrumbs.files.map((f, i) => (
                <div key={f.id} className={css.iconWithTexContainer}>
                  <Link
                    className={css.link}
                    to={
                      i === breadcrumbs.files.length - 1
                        ? `/${f.productionId}/drive${
                            breadcrumbs.files.length > 1
                              ? `/${breadcrumbs.files[i - 1].id}`
                              : ""
                          }`
                        : `/${f.productionId}/drive/${f.id}`
                    }
                  >
                    <div
                      className={
                        i === breadcrumbs.files.length - 1
                          ? css.textDescriptionSelected
                          : css.textDescription
                      }
                    >
                      {f.name}
                    </div>
                    {i < breadcrumbs.files.length - 1 && (
                      <i className={`material-icons ${css.imgArrow}`}>
                        keyboard_arrow_right
                      </i>
                    )}
                  </Link>
                </div>
              ))}
              {isFavorite ? (
                <ButtonBase
                  disableRipple
                  onClick={() => this.toggleFavorite(false)}
                >
                  <FavoritedIcon style={{ color: vars.colorGrayDove }} />
                </ButtonBase>
              ) : (
                <ButtonBase
                  disableRipple
                  onClick={() => this.toggleFavorite(true)}
                >
                  <UnfavoritedIcon style={{ color: vars.colorGrayDove }} />
                </ButtonBase>
              )}
              <button className={css.button}>
                <img
                  alt=""
                  className={css.imgMedium}
                  src={imgFolderGreywithArrow}
                />
              </button>
              <ButtonBase
                buttonRef={ref => {
                  this.contextMenuRef = ref;
                }}
                disableRipple
                className={css.buttonBase}
                onClick={e => this.handleToggleContextMenu()}
              >
                <MoreVerticalIcon
                  classes={{
                    root: css.moreVerticalIcon
                  }}
                />
              </ButtonBase>
              <Popper
                open={showContextualMenu}
                anchorEl={this.contextMenuRef}
                placement="bottom-end"
                disablePortal
                transition
                className={css.popper}
                modifiers={{
                  preventOverflow: {
                    enabled: false
                  },
                  arrow: {
                    enabled: true,
                    element: this.arrowRef
                  }
                }}
              >
                {({ TransitionProps }) => (
                  <Fragment>
                    <span
                      className={css.arrow}
                      ref={ref => {
                        this.arrowRef = ref;
                      }}
                    />
                    <Grow
                      {...TransitionProps}
                      id={`contextual-menu`}
                      style={{ transformOrigin: "center top" }}
                    >
                      <Paper>
                        <ClickAwayListener
                          onClickAway={e => this.handleToggleContextMenu()}
                        >
                          <MenuList>
                            <MenuItem
                              classes={{
                                root: css.contextMenuItem
                              }}
                            >
                              <img
                                className={css.contextMenuIcon}
                                alt="Manage Collaborators"
                                src={ManageCollabIcon}
                              />
                              <span className={css.contextMenuTitle}>
                                Manage Collaborators
                              </span>
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: css.contextMenuItem
                              }}
                            >
                              <img
                                className={css.contextMenuIcon}
                                alt="Share Link"
                                src={ShareLinkIcon}
                              />
                              <span className={css.contextMenuTitle}>
                                Share Link
                              </span>
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: css.contextMenuItem
                              }}
                            >
                              <img
                                className={css.contextMenuIcon}
                                alt="Move"
                                src={MoveIcon}
                              />
                              <span className={css.contextMenuTitle}>
                                Move to...
                              </span>
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: css.contextMenuItem
                              }}
                            >
                              <img
                                className={css.contextMenuIcon}
                                alt="Mark as favorite"
                                src={MarkAsFavoriteIcon}
                              />
                              <span className={css.contextMenuTitle}>
                                Mark as Favorite
                              </span>
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: css.contextMenuItem
                              }}
                            >
                              <img
                                className={css.contextMenuIcon}
                                alt="Rename"
                                src={RenameIcon}
                              />
                              <span className={css.contextMenuTitle}>
                                Rename
                              </span>
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: css.contextMenuItem
                              }}
                            >
                              <img
                                className={css.contextMenuIcon}
                                alt="Duplicate"
                                src={DuplicateIcon}
                              />
                              <span className={css.contextMenuTitle}>
                                Duplicate
                              </span>
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: css.contextMenuItem
                              }}
                            >
                              <img
                                className={css.contextMenuIcon}
                                alt="Download"
                                src={DownloadIcon}
                              />
                              <span className={css.contextMenuTitle}>
                                Download
                              </span>
                            </MenuItem>
                            <MenuItem
                              classes={{
                                root: css.contextMenuItem
                              }}
                            >
                              <img
                                className={css.contextMenuIcon}
                                alt="Move to trash"
                                src={TrashIcon}
                              />
                              <span className={css.contextMenuTitle}>
                                Move to Trash
                              </span>
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  </Fragment>
                )}
              </Popper>
            </div>
          )}
        </div>
        <div className={css.headerUsersContainer}>
          <div className={css.headerUsers}>
            {this.props.users.map(u => (
              <button key={u.id} className={css.button}>
                <UserAvatar
                  user={u}
                  style={{ color: "#ffffff", marginLeft: 5 }}
                />
              </button>
            ))}
          </div>
          <div className={css.questionIcon}>
            <button
              className={`${css.button} ${css.helpButtom}`}
              onClick={this.onClickHelpAndFeedback}
            >
              <img alt="" className={css.imgQuestion} src={imgQuestion} />
              <div className={css.textDescriptionSmall}>Help and feedback</div>
            </button>
          </div>
        </div>
      </header>
    );
  }
}
