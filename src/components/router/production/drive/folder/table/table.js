// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Fragment, PureComponent } from "react";
import filesize from "filesize";
import Moment from "react-moment";
import { DragDropContextProvider, DropTargetMonitor } from "react-dnd";
import HTML5Backend, { NativeTypes } from "react-dnd-html5-backend";
import { findIndex, get } from "lodash";
import MoveFileModal from "src/components/shared/Modal/MoveFile";
import RenameFileModal from "src/components/shared/Modal/RenameFile";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Checkbox from "@material-ui/core/Checkbox";
import ButtonBase from "@material-ui/core/ButtonBase";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import UnfavoritedIcon from "@material-ui/icons/StarBorder";
import FavoritedIcon from "@material-ui/icons/Star";
import MoreHorizontalIcon from "@material-ui/icons/MoreHoriz";
import FolderIcon from "static/images/folderIcon.svg";
import ScreenplayIcon from "static/images/screenplayIcon.svg";
import ManageCollabIcon from "static/images/contextMenuManageCollabIcon.svg";
import DownloadIcon from "static/images/contextMenuDownloadIcon.svg";
import DuplicateIcon from "static/images/contextMenuDuplicateIcon.svg";
import MarkAsFavoriteIcon from "static/images/contextMenuMarkAsFavoriteIcon.svg";
import MoveIcon from "static/images/contextMenuMoveIcon.svg";
import RenameIcon from "static/images/contextMenuRenameIcon.svg";
import ShareLinkIcon from "static/images/contextMenuShareLinkIcon.svg";
import TrashIcon from "static/images/contextMenuTrashIcon.svg";
import { FileTypes } from "src/redux/modules/drive";
import classNames from "classnames";
import Dropzone from "../dropzone";
import css from "./table.style.css";
import type { Props } from "./";
import type { File } from "src/redux/modules/drive";

const CheckboxTableCell = withStyles(theme => ({
  root: {
    width: "2%"
  }
}))(TableCell);

const StyledCheckbox = withStyles(theme => ({
  root: {
    transform: "scale(0.85)",
    color: "#c5d9e8"
  },
  checked: {
    transform: "scale(0.85)",
    color: "#4ece3d"
  }
}))(Checkbox);

const HeaderCheckbox = withStyles(theme => ({
  root: {
    transform: "scale(0.85)",
    color: "#c5d9e8",
    height: "32px"
  },
  checked: {
    transform: "scale(0.85)",
    color: "#4ece3d"
  }
}))(Checkbox);

type State = {
  mouseOver: ?string,
  contextMenuOn: ?string,
  moveFileDialog: ?File,
  renameFileDialog: ?File
};

export default class FilesTable extends PureComponent<Props, State> {
  contextMenuRefs: { [id: string]: ?HTMLElement } = {};
  arrowRefs: { [id: string]: ?HTMLElement } = {};

  state: State = {
    mouseOver: null,
    contextMenuOn: null,
    moveFileDialog: null,
    renameFileDialog: null
  };

  static columnData = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Name"
    },
    {
      id: "fileSize",
      numeric: false,
      disablePadding: false,
      label: "File Size"
    },
    {
      id: "updatedAt",
      numeric: false,
      disablePadding: false,
      label: "Date Modified"
    },
    {
      id: "actions",
      numeric: false,
      disablePadding: false,
      label: ""
    }
  ];

  isMovingFile(f: File): boolean {
    return !!this.state.moveFileDialog && this.state.moveFileDialog.id === f.id;
  }

  isRenamingFile(f: File): boolean {
    return (
      !!this.state.renameFileDialog && this.state.renameFileDialog.id === f.id
    );
  }

  handleSelectAllClick = (e: Event) => {
    e.preventDefault();

    const { selectedFiles, toggleSelected, files } = this.props;
    const allSelected = selectedFiles.length === files.length;

    if (allSelected) {
      toggleSelected(files.map(f => f.id));
    } else {
      const selectedIds = selectedFiles.map(f => f.id);
      toggleSelected(
        files.filter(f => !selectedIds.includes(f.id)).map(f => f.id)
      );
    }

    return false;
  };

  onClickTableRow = (e: SyntheticMouseEvent<HTMLElement>, file: File) => {
    if (e) e.preventDefault();
    this.onClickFile(file, false);
  };

  onClickCheckbox = (e: SyntheticMouseEvent<HTMLElement>, file: File) => {
    if (e) e.preventDefault();
    this.onClickFile(file, true);
  };

  onClickFile = (file: File, multiSelect: boolean = false) => {
    const { selectedFiles, toggleSelected } = this.props;

    if (!selectedFiles.length) {
      toggleSelected([file.id]);
      return false;
    }

    if (multiSelect) {
      // Add or remove from selection with cmd/win/alt
      toggleSelected([file.id]);
    } else {
      // Reset selection to only include the new item
      const fileIdsToToggle = [...selectedFiles.map(f => f.id)];
      const index = findIndex(fileIdsToToggle, id => id === file.id);

      if (index === -1) {
        fileIdsToToggle.push(file.id);
      }

      toggleSelected(fileIdsToToggle);
    }

    return false;
  };

  isSelected(fileId: string) {
    const { selectedFiles } = this.props;
    return selectedFiles.map(f => f.id).includes(fileId);
  }

  handleDoubleClick = async (e: Event, file: File) => {
    e.preventDefault();

    const { history } = this.props;
    const productionId = parseInt(
      get(this.props, "match.params.productionId"),
      10
    );

    switch (file.fileType) {
      case FileTypes.FOLDER:
        history.push(`/${productionId}/drive/${file.id}`);
        break;

      case FileTypes.SCREENPLAY:
        if (file.screenplayId) {
          history.push(`/${productionId}/s/${file.screenplayId}/edit`);
        }
        break;

      case FileTypes.UPLOAD: {
        const { getDownloadUrl, downloadFile } = this.props;
        const url = get(file, "download.url");

        if (url) {
          downloadFile(file.id);
        } else {
          getDownloadUrl(productionId, file.id, null, true);
        }

        break;
      }

      default:
        // nothing
        break;
    }

    return false;
  };

  toggleFavorite = (e: Event, file: File, favorite: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    const { currentUser, toggleFavorite } = this.props;
    const productionId = get(this.props, "match.params.productionId");

    if (!productionId || !currentUser) return;

    toggleFavorite(productionId, file.id, favorite, currentUser.id);
  };

  static renderFileIcon(file: File) {
    switch (file.fileType) {
      case FileTypes.FOLDER:
        return (
          <img src={FolderIcon} className={css.fileIcon} alt={file.name} />
        );
      case FileTypes.SCREENPLAY:
        return (
          <img src={ScreenplayIcon} className={css.fileIcon} alt={file.name} />
        );
      case FileTypes.UPLOAD:
        return (
          <img src={ScreenplayIcon} className={css.fileIcon} alt={file.name} />
        );
      default:
        return null;
    }
  }

  handleMouseEnter = (f: File) => {
    this.setState({
      mouseOver: f.id
    });
  };

  handleMouseLeave = (f: File) => {
    this.setState((state: State) => ({
      mouseOver: state.mouseOver === f.id ? null : state.mouseOver
    }));
  };

  handleToggleContextMenu = (e: Event, f: File) => {
    e.preventDefault();

    this.setState((state: State) => ({
      contextMenuOn: state.contextMenuOn === f.id ? null : f.id
    }));
  };

  handleFileDrop = (item: any, monitor: DropTargetMonitor) => {
    if (!monitor) {
      return;
    }

    const pId = get(this.props, "match.params.productionId");
    const folderId = get(this.props, "match.params.folderId");
    if (!pId) return;
    const productionId = parseInt(pId, 10);

    const { uploadFile } = this.props;
    const { files } = monitor.getItem();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadFile(productionId, file, file.name, folderId);
    }
  };

  handleToggleMoveFileDialog = (f: File) => {
    this.setState((state: State) => ({
      contextMenuOn: null,
      moveFileDialog:
        state.moveFileDialog && state.moveFileDialog.id === f.id ? null : f
    }));
  };

  handleToggleRenameFileDialog = (f: File) => {
    this.setState((state: State) => ({
      contextMenuOn: null,
      renameFileDialog:
        state.renameFileDialog && state.renameFileDialog.id === f.id ? null : f
    }));
  };

  handleToggleFavorite = (e: Event, f: File) => {
    const { currentUser, match, toggleFavorite } = this.props;
    if (!currentUser) return;

    const productionId = parseInt(get(match, "params.productionId", "0"), 10);

    toggleFavorite(productionId, f.id, !this.isFavorite(f), currentUser.id);
    this.handleToggleContextMenu(e, f);
  };

  isFavorite(f: File) {
    const { currentUser } = this.props;
    return (f.favoritedBy || []).includes(get(currentUser, "id", "guest"));
  }

  handleDuplicate = (e: Event, f: File) => {
    const { match, duplicateFile } = this.props;
    const productionId = parseInt(get(match, "params.productionId", "0"), 10);
    const folderId = get(match, "params.folderId");

    duplicateFile(productionId, f.id, `Copy of ${f.name}`, folderId);
    this.handleToggleContextMenu(e, f);
  };

  handleDownload = (e: Event, f: File) => {
    const { getDownloadUrl, downloadFile, match } = this.props;
    const url = get(f, "download.url");

    if (url) {
      downloadFile(f.id);
    } else {
      const productionId = parseInt(get(match, "params.productionId", "0"), 10);
      getDownloadUrl(productionId, f.id);
    }

    this.handleToggleContextMenu(e, f);
  };

  handleDelete = (e: Event, f: File) => {
    const { match, deleteFile } = this.props;
    const productionId = parseInt(get(match, "params.productionId", "0"), 10);

    deleteFile(productionId, f.id);
    this.handleToggleContextMenu(e, f);
  };

  render() {
    const { files, selectedFiles, allFilesAreSelected } = this.props;
    const { columnData } = FilesTable;
    const numSelected = selectedFiles.length;
    const { FILE } = NativeTypes;

    // noinspection HtmlDeprecatedAttribute
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <Dropzone accepts={[FILE]} onDrop={this.handleFileDrop}>
          <Paper className={css.paper}>
            <div className={css.tableWrapper}>
              <Table className={css.table} aria-labelledby="tableTitle">
                <TableHead>
                  <TableRow
                    hover
                    selected
                    height="32px"
                    padding="dense"
                    classes={{
                      root: css.row,
                      head: css.tableRowHead
                    }}
                  >
                    <TableCell padding="checkbox" className={css.head}>
                      <HeaderCheckbox
                        indeterminate={numSelected > 0 && !allFilesAreSelected}
                        checked={!!files.length && allFilesAreSelected}
                        onClick={this.handleSelectAllClick}
                        disabled={!files.length}
                      />
                    </TableCell>
                    {columnData.map(column => (
                      <TableCell
                        key={column.id}
                        align={column.numeric ? "right" : "left"}
                        padding={column.disablePadding ? "none" : "default"}
                        sortDirection={false}
                        className={css.head}
                      >
                        <TableSortLabel
                          active={false}
                          direction={"asc"}
                          onClick={(e: Event) => e.preventDefault()}
                          classes={{
                            root: css.tableSortLabel
                          }}
                        >
                          {column.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {files.map(f => {
                    const isSelected = this.isSelected(f.id);
                    const isMouseOver = this.state.mouseOver === f.id;
                    const isFavorite = this.isFavorite(f);
                    const contextMenuOpen = this.state.contextMenuOn === f.id;
                    const contextMenuAnchor = this.contextMenuRefs[f.id];
                    const arrowRef = this.arrowRefs[f.id];

                    return (
                      <TableRow
                        hover
                        onDoubleClick={e => this.handleDoubleClick(e, f)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={f.id}
                        selected={isSelected}
                        onMouseEnter={() => this.handleMouseEnter(f)}
                        onMouseLeave={() => this.handleMouseLeave(f)}
                        classes={{
                          root: css.tableRow
                        }}
                      >
                        <CheckboxTableCell padding="checkbox">
                          <StyledCheckbox
                            checked={isSelected}
                            onClick={e => this.onClickCheckbox(e, f)}
                          />
                        </CheckboxTableCell>
                        <TableCell
                          onClick={e => this.onClickTableRow(e, f)}
                          component="td"
                          scope="row"
                          padding="none"
                          classes={{
                            root: css.fileNameTableCell
                          }}
                        >
                          {FilesTable.renderFileIcon(f)}
                          <span className={css.fileName}>{f.name}</span>
                          {isFavorite && (
                            <ButtonBase
                              disableRipple
                              onClick={e => this.toggleFavorite(e, f, false)}
                            >
                              <FavoritedIcon color="primary" />
                            </ButtonBase>
                          )}
                          {isMouseOver &&
                            !isFavorite && (
                              <ButtonBase
                                disableRipple
                                onClick={e => this.toggleFavorite(e, f, true)}
                              >
                                <UnfavoritedIcon color="primary" />
                              </ButtonBase>
                            )}
                        </TableCell>
                        <TableCell
                          onClick={e => this.onClickTableRow(e, f)}
                          classes={{
                            root: css.tableCell
                          }}
                        >
                          <span className={css.fileSize}>
                            {f.fileSize === 0 ? "-" : filesize(f.fileSize)}
                          </span>
                        </TableCell>
                        <TableCell
                          onClick={e => this.onClickTableRow(e, f)}
                          classes={{
                            root: css.tableCell
                          }}
                        >
                          <span className={css.dateModified}>
                            <Moment format="l LT">{f.updatedAt}</Moment>
                          </span>
                        </TableCell>
                        <TableCell
                          classes={{
                            root: classNames(
                              css.tableCell,
                              css.moreHorizontalTableCell
                            )
                          }}
                        >
                          <ButtonBase
                            buttonRef={ref => {
                              this.contextMenuRefs[f.id] = ref;
                            }}
                            disableRipple
                            className={css.buttonBase}
                            onClick={e => this.handleToggleContextMenu(e, f)}
                          >
                            <MoreHorizontalIcon
                              classes={{
                                root: css.moreHorizontalIcon
                              }}
                            />
                          </ButtonBase>
                          <Popper
                            open={contextMenuOpen}
                            anchorEl={contextMenuAnchor}
                            placement="bottom-end"
                            disablePortal
                            transition
                            className={css.popper}
                            modifiers={{
                              preventOverflow: {
                                enabled: true,
                                boundariesElement: "viewport"
                              },
                              arrow: {
                                enabled: true,
                                element: arrowRef
                              }
                            }}
                          >
                            {({ TransitionProps }) => (
                              <Fragment>
                                <span
                                  className={css.arrow}
                                  ref={ref => {
                                    this.arrowRefs[f.id] = ref;
                                  }}
                                />
                                <Grow
                                  {...TransitionProps}
                                  id={`menu-${f.id}`}
                                  style={{ transformOrigin: "center top" }}
                                >
                                  <Paper>
                                    <ClickAwayListener
                                      onClickAway={e =>
                                        this.handleToggleContextMenu(e, f)
                                      }
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
                                          <span
                                            className={css.contextMenuTitle}
                                          >
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
                                          <span
                                            className={css.contextMenuTitle}
                                          >
                                            Share Link
                                          </span>
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() =>
                                            this.handleToggleMoveFileDialog(f)
                                          }
                                          classes={{
                                            root: css.contextMenuItem
                                          }}
                                        >
                                          <img
                                            className={css.contextMenuIcon}
                                            alt="Move"
                                            src={MoveIcon}
                                          />
                                          <span
                                            className={css.contextMenuTitle}
                                          >
                                            Move to...
                                          </span>
                                        </MenuItem>
                                        <MenuItem
                                          onClick={e =>
                                            this.handleToggleFavorite(e, f)
                                          }
                                          classes={{
                                            root: css.contextMenuItem
                                          }}
                                        >
                                          <img
                                            className={css.contextMenuIcon}
                                            alt={
                                              isFavorite
                                                ? "Remove from favorites"
                                                : "Mark as favorite"
                                            }
                                            src={MarkAsFavoriteIcon}
                                          />
                                          <span
                                            className={css.contextMenuTitle}
                                          >
                                            {isFavorite
                                              ? "Remove from favorites"
                                              : "Mark as favorite"}
                                          </span>
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() =>
                                            this.handleToggleRenameFileDialog(f)
                                          }
                                          classes={{
                                            root: css.contextMenuItem
                                          }}
                                        >
                                          <img
                                            className={css.contextMenuIcon}
                                            alt="Rename"
                                            src={RenameIcon}
                                          />
                                          <span
                                            className={css.contextMenuTitle}
                                          >
                                            Rename
                                          </span>
                                        </MenuItem>
                                        <MenuItem
                                          onClick={e =>
                                            this.handleDuplicate(e, f)
                                          }
                                          classes={{
                                            root: css.contextMenuItem
                                          }}
                                        >
                                          <img
                                            className={css.contextMenuIcon}
                                            alt="Duplicate"
                                            src={DuplicateIcon}
                                          />
                                          <span
                                            className={css.contextMenuTitle}
                                          >
                                            Duplicate
                                          </span>
                                        </MenuItem>
                                        <MenuItem
                                          onClick={e =>
                                            this.handleDownload(e, f)
                                          }
                                          classes={{
                                            root: css.contextMenuItem
                                          }}
                                        >
                                          <img
                                            className={css.contextMenuIcon}
                                            alt="Download"
                                            src={DownloadIcon}
                                          />
                                          <span
                                            className={css.contextMenuTitle}
                                          >
                                            Download
                                          </span>
                                        </MenuItem>
                                        <MenuItem
                                          onClick={e => this.handleDelete(e, f)}
                                          classes={{
                                            root: css.contextMenuItem
                                          }}
                                        >
                                          <img
                                            className={css.contextMenuIcon}
                                            alt="Move to trash"
                                            src={TrashIcon}
                                          />
                                          <span
                                            className={css.contextMenuTitle}
                                          >
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

                          <Dialog
                            open={this.isMovingFile(f)}
                            onClose={() => this.handleToggleMoveFileDialog(f)}
                          >
                            <MoveFileModal
                              file={f}
                              onClose={() => this.handleToggleMoveFileDialog(f)}
                            />
                          </Dialog>

                          <Dialog
                            open={this.isRenamingFile(f)}
                            onClose={() => this.handleToggleRenameFileDialog(f)}
                          >
                            <RenameFileModal
                              file={f}
                              onClose={() =>
                                this.handleToggleRenameFileDialog(f)
                              }
                            />
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Paper>
        </Dropzone>
      </DragDropContextProvider>
    );
  }
}
