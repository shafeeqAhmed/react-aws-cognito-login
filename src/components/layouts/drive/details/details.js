// @flow
/* eslint-disable import/no-extraneous-dependencies,class-methods-use-this */
import React, { Fragment, PureComponent } from "react";
import { get } from "lodash";
import moment from "moment";
import filesize from "filesize";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import RightChevronIcon from "@material-ui/icons/ChevronRight";
import NewFileIcon from "static/images/newFileIcon.svg";
import MoveFileModal from "src/components/shared/Modal/MoveFile";
import RenameFileModal from "src/components/shared/Modal/RenameFile";
import ShareFileModal from "src/components/shared/Modal/ShareFile";
import UserAvatar from "src/components/shared/UserAvatar";
import { Sections, fileExtension } from "src/redux/modules/drive";
import { displayName } from "src/redux/modules/users";
import css from "./details.style.css";
import FileIcon from "src/components/shared/FileIcon";
import type { Props } from "./";

type State = {
  newMenuOpen: boolean,
  newFolderDialogOpen: boolean,
  newFolderName: string,
  newFileDialogOpen: boolean,
  newFileName: string,
  moveFileDialogOpen: boolean,
  renameFileDialogOpen: boolean,
  shareFileDialogOpen: boolean
};

export default class Details extends PureComponent<Props, State> {
  newMenuAnchorEl: ?HTMLElement;
  fileInput: ?HTMLInputElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      newMenuOpen: false,
      newFolderDialogOpen: false,
      newFolderName: "",
      newFileDialogOpen: false,
      newFileName: "",
      moveFileDialogOpen: false,
      renameFileDialogOpen: false,
      shareFileDialogOpen: false
    };
  }

  handleToggleNewMenu = () => {
    this.setState((state: State) => ({
      newMenuOpen: !state.newMenuOpen
    }));
  };

  handleToggleNewFolderDialog = () => {
    this.setState((state: State) => ({
      newFolderDialogOpen: !state.newFolderDialogOpen,
      newFolderName: ""
    }));
  };

  handleToggleNewFileDialog = () => {
    this.setState((state: State) => ({
      newFileDialogOpen: !state.newFileDialogOpen,
      newFileName: ""
    }));
  };

  handleToggleMoveFileDialog = () => {
    this.setState((state: State) => ({
      moveFileDialogOpen: !state.moveFileDialogOpen
    }));
  };

  handleToggleShareFileDialog = () => {
    this.setState((state: State) => ({
      shareFileDialogOpen: !state.shareFileDialogOpen
    }));
  };

  handleToggleRenameFileDialog = () => {
    this.setState((state: State) => ({
      renameFileDialogOpen: !state.renameFileDialogOpen
    }));
  };

  handleCloseNewMenu = (e?: Event) => {
    if (e && e.target instanceof HTMLElement) {
      if (this.newMenuAnchorEl && this.newMenuAnchorEl.contains(e.target)) {
        return;
      }
    }

    this.setState({ newMenuOpen: false });
  };

  handleNewFolderButtonClick = (e: Event) => {
    this.handleToggleNewFolderDialog();
    this.handleCloseNewMenu(e);
  };

  handleNewFileButtonClick = (e: Event) => {
    this.handleToggleNewFileDialog();
    this.handleCloseNewMenu(e);
  };

  handleCreateNewFolder = () => {
    const name = this.state.newFolderName;
    const productionId = get(this.props, "match.params.productionId", "");
    const folderId = get(this.props, "match.params.folderId", "");

    if (productionId) {
      this.props.createFolder(productionId, name, folderId);
    }

    this.handleToggleNewFolderDialog();
  };

  handleCreateNewFile = () => {
    const name = this.state.newFileName;
    const productionId = get(this.props, "match.params.productionId", "");
    const folderId = get(this.props, "match.params.folderId", "");

    if (productionId) {
      this.props.createScreenplay(productionId, name, folderId);
    }

    this.handleToggleNewFileDialog();
  };

  handleChangeNewFolderName = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      newFolderName: get(e, "target.value", "")
    });
  };

  handleKeypressNewFolderName = (
    e: SyntheticKeyboardEvent<HTMLInputElement>
  ) => {
    if (e && e.key === "Enter") {
      e.preventDefault();
      this.handleChangeNewFolderName(e);
      this.handleCreateNewFolder();
    }
  };

  handleChangeNewFileName = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      newFileName: get(e, "target.value", "")
    });
  };

  handleKeypressNewFileName = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e && e.key === "Enter") {
      e.preventDefault();
      this.handleChangeNewFileName(e);
      this.handleCreateNewFile();
    }
  };

  handleDeleteSelected = () => {
    const { selectedFiles, deleteFile } = this.props;
    const productionId = get(this.props, "match.params.productionId", "");

    if (!productionId) return;

    selectedFiles.map(file => deleteFile(productionId, file.id));
    this.handleClearSelection();
  };

  handleRestore = () => {
    const { selectedFiles, restoreFile } = this.props;
    const productionId = get(this.props, "match.params.productionId", "");

    if (!productionId) return;

    selectedFiles.map(
      file => file.deletedAt && restoreFile(productionId, file.id)
    );
    this.handleClearSelection();
  };

  handleMarkSelectedAsFavorite = (favorite: boolean = true) => {
    const { selectedFiles, toggleFavorite, currentUser } = this.props;
    const productionId = get(this.props, "match.params.productionId", "");

    if (!productionId || !currentUser) return;

    selectedFiles.map(file =>
      toggleFavorite(productionId, file.id, favorite, currentUser.id)
    );
  };

  handleClearSelection = () => {
    const { selectedFiles, toggleSelected } = this.props;
    toggleSelected(selectedFiles.map(f => f.id));
  };

  handleFileInputChange = (e: Event) => {
    const { match, uploadFile } = this.props;
    const productionId = parseInt(get(match, "params.productionId", "0"), 10);
    const folderId = get(match, "params.folderId");

    const files = get(e, "target.files", []);

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      uploadFile(productionId, file, file.name, folderId);
    }

    this.handleCloseNewMenu();
  };

  handleCopy = () => {
    const { selectedFiles, copy } = this.props;
    copy(selectedFiles.map(f => f.id));
  };

  handlePaste = () => {
    const { match, paste } = this.props;
    const productionId = parseInt(get(match, "params.productionId", "0"), 10);
    const folderId = get(match, "params.folderId");

    paste(productionId, folderId);
  };

  handleDuplicate = () => {
    const { match, selectedFiles, copy, paste } = this.props;
    const productionId = parseInt(get(match, "params.productionId", "0"), 10);
    const folderId = get(match, "params.folderId");

    copy(selectedFiles.map(f => f.id));
    paste(productionId, folderId);
  };

  renderWithNoSelection() {
    const { clipboard, match } = this.props;
    const folderId = get(match, "params.folderId");

    switch (folderId) {
      case Sections.TRASH:
      case Sections.RECENT:
      case Sections.FAVORITES:
        return null;

      case Sections.FILES:
      default:
        return (
          <Fragment>
            <div className={css.numSelected} />
            <div className={css.buttons}>
              <Button
                buttonRef={node => {
                  this.newMenuAnchorEl = node;
                }}
                aria-owns={this.state.newMenuOpen ? "new-menu-grow" : null}
                aria-haspopup={"true"}
                onClick={this.handleToggleNewMenu}
                color="primary"
                variant="contained"
                classes={{
                  root: css.button,
                  label: css.buttonLabel
                }}
              >
                <img className={css.buttonImage} alt="New" src={NewFileIcon} />
                <span className={css.buttonText}>New</span>
              </Button>
              <Popper
                open={this.state.newMenuOpen}
                anchorEl={this.newMenuAnchorEl}
                transition
                disablePortal
                className={css.popper}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    in={this.state.newMenuOpen}
                    id={"new-menu-grow"}
                    style={{
                      tranformOrigin:
                        placement === "bottom" ? "center top" : "center bottom"
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={this.handleCloseNewMenu}>
                        <MenuList>
                          <MenuItem onClick={this.handleNewFileButtonClick}>
                            <div>Schedule</div>
                          </MenuItem>
                          <MenuItem onClick={this.handleNewFolderButtonClick}>
                            <div>Folder</div>
                          </MenuItem>
                          <label htmlFor="file-upload-input">
                            <MenuItem>
                              <input
                                id="file-upload-input"
                                ref={ref => {
                                  this.fileInput = ref;
                                }}
                                type="file"
                                style={{ display: "none" }}
                                multiple
                                value=""
                                onChange={this.handleFileInputChange}
                              />
                              <div>Upload</div>
                            </MenuItem>
                          </label>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
            <div className={css.actions}>
              {clipboard &&
                !!clipboard.fileIds.length && (
                  <Button
                    onClick={() => this.handlePaste()}
                    classes={{
                      root: css.action,
                      label: css.actionLabel
                    }}
                  >
                    Paste
                  </Button>
                )}
            </div>
          </Fragment>
        );
    }
  }

  renderWithOneSelectedFile() {
    const {
      folder,
      match,
      selectedFiles,
      currentUser,
      selectedFileSubjects,
      selectedFileOwner
    } = this.props;
    const folderId = get(match, "params.folderId");
    const allSelectedAreFavorites = (
      selectedFiles[0].favoritedBy || []
    ).includes(get(currentUser, "id"));
    const fileIsShared =
      selectedFileSubjects.users.length ||
      selectedFileSubjects.tags.length ||
      selectedFileSubjects.departments.length;

    switch (folderId) {
      case Sections.TRASH:
        return (
          <Fragment>
            <div className={css.numSelected}>
              <span className={css.numSelectedLabel}>1 Item Selected</span>
            </div>
            <div className={css.buttons} />
            <div className={css.actions}>
              <Button
                onClick={this.handleRestore}
                classes={{
                  root: css.action,
                  label: css.actionLabel
                }}
              >
                Restore
              </Button>
            </div>
          </Fragment>
        );

      case Sections.RECENT:
      case Sections.FAVORITES:
        return null;

      case Sections.FILES:
      default:
        return (
          <Fragment>
            <div className={css.numSelected}>
              <span className={css.numSelectedLabel}>1 Item Selected</span>
            </div>

            <div className={css.buttons}>
              <Button
                onClick={this.handleToggleShareFileDialog}
                color="primary"
                variant="contained"
                classes={{
                  root: css.button,
                  label: css.buttonLabel
                }}
              >
                <img
                  className={css.buttonImage}
                  alt="manage collaborators"
                  src={NewFileIcon}
                />
                <span className={css.buttonText}>Manage Collaborators</span>
              </Button>
            </div>

            {fileIsShared ? (
              <div className={css.shareApercu}>
                <div className={css.policySubjects}>
                  {selectedFileSubjects.users.length ? (
                    <div className={css.policyUsers}>
                      {selectedFileSubjects.users.map(
                        u => u && <UserAvatar user={u} key={u.id} />
                      )}
                    </div>
                  ) : null}
                  {selectedFileSubjects.tags.length ||
                  selectedFileSubjects.departments.length ? (
                    <div className={css.policyTags}>
                      {selectedFileSubjects.departments.map(
                        d =>
                          d && (
                            <span className={css.policyTag} key={d.id}>
                              {d.name}
                            </span>
                          )
                      )}
                      {selectedFileSubjects.tags.map(
                        t =>
                          t && (
                            <span className={css.policyTag} key={t.id}>
                              {t.name}
                            </span>
                          )
                      )}
                    </div>
                  ) : null}
                </div>
                <div className={css.shareChevron}>
                  <IconButton
                    className={css.shareChevronIconButton}
                    onClick={this.handleToggleShareFileDialog}
                  >
                    <RightChevronIcon className={css.shareChevronIcon} />
                  </IconButton>
                </div>
              </div>
            ) : null}

            <div className={css.actions}>
              <Button
                classes={{
                  root: css.action,
                  label: css.actionLabel
                }}
              >
                Share Link
              </Button>
              <Button
                onClick={this.handleToggleMoveFileDialog}
                classes={{
                  root: css.action,
                  label: css.actionLabel
                }}
              >
                Move to...
              </Button>
              <Button
                classes={{
                  root: css.action,
                  label: css.actionLabel
                }}
                onClick={this.handleNewFolderButtonClick}
              >
                New Folder
              </Button>
              <Button
                classes={{
                  root: css.action,
                  label: css.actionLabel
                }}
                onClick={() =>
                  this.handleMarkSelectedAsFavorite(!allSelectedAreFavorites)
                }
              >
                {allSelectedAreFavorites
                  ? "Remove from favorites"
                  : "Mark as favorite"}
              </Button>
              <Button
                onClick={this.handleDuplicate}
                classes={{
                  root: css.action,
                  label: css.actionLabel
                }}
              >
                Duplicate
              </Button>
              <Button
                onClick={this.handleToggleRenameFileDialog}
                classes={{
                  root: css.action,
                  label: css.actionLabel
                }}
              >
                Rename
              </Button>
              <Button
                classes={{
                  root: css.action,
                  label: css.actionLabel
                }}
                onClick={this.handleDeleteSelected}
              >
                Delete
              </Button>
            </div>

            <div className={css.fileApercu}>
              <div className={css.fileApercuGraphic}>
                <FileIcon
                  className={css.fileApercuIcon}
                  file={selectedFiles[0]}
                />
                <span className={css.fileExtensionText}>
                  {fileExtension(selectedFiles[0])}
                </span>
              </div>
              <div className={css.fileName}>
                <span className={css.fileNameText}>
                  {selectedFiles[0].name}
                </span>
              </div>
              <div className={css.fileAttributes}>
                <div className={css.fileAttribute}>
                  <span className={css.fileAttributeLabel}>Size</span>
                  <span className={css.fileAttributeValue}>
                    {filesize(selectedFiles[0].fileSize)}
                  </span>
                </div>
                <div className={css.fileAttribute}>
                  <span className={css.fileAttributeLabel}>Location</span>
                  <span className={css.fileAttributeValue}>
                    {get(folder, "name", "")}
                  </span>
                </div>
                {selectedFileOwner ? (
                  <div className={css.fileAttribute}>
                    <span className={css.fileAttributeLabel}>Owner</span>
                    <span className={css.fileAttributeValue}>
                      {displayName(selectedFileOwner)}
                    </span>
                  </div>
                ) : null}
                <div className={css.fileAttribute}>
                  <span className={css.fileAttributeLabel}>Modified</span>
                  <span className={css.fileAttributeValue}>
                    {moment(selectedFiles[0].updatedAt).format("DD MMM YYYY")}
                  </span>
                </div>
                <div className={css.fileAttribute}>
                  <span className={css.fileAttributeLabel}>Created</span>
                  <span className={css.fileAttributeValue}>
                    {moment(selectedFiles[0].createdAt).format("DD MMM YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </Fragment>
        );
    }
  }

  renderWithSeveralSelectedFiles() {
    const { selectedFiles, history } = this.props;

    return (
      <Fragment>
        <div className={css.numSelected}>
          <span className={css.numSelectedLabel}>
            {selectedFiles.length} Items Selected
          </span>
        </div>
        <div className={css.buttons}>
          <Button
            color="primary"
            variant="contained"
            classes={{
              root: css.button,
              label: css.buttonLabel
            }}
            onClick={() => {
              history.push({
                pathname: this.props.location.pathname,
                state: {
                  modal: "move-file"
                }
              });
            }}
          >
            <img className={css.buttonImage} alt="move to" src={NewFileIcon} />
            <span className={css.buttonText}>Move to</span>
          </Button>
        </div>
        <div className={css.actions}>
          <Button
            onClick={this.handleCopy}
            classes={{
              root: css.action,
              label: css.actionLabel
            }}
          >
            Copy
          </Button>
          <Button
            onClick={this.handlePaste}
            classes={{
              root: css.action,
              label: css.actionLabel
            }}
          >
            Paste
          </Button>
          <Button
            classes={{
              root: css.action,
              label: css.actionLabel
            }}
            onClick={this.handleClearSelection}
          >
            Deselect
          </Button>
          <Button
            classes={{
              root: css.action,
              label: css.actionLabel
            }}
            onClick={this.handleDeleteSelected}
          >
            Delete
          </Button>
        </div>
      </Fragment>
    );
  }

  render() {
    const { selectedFiles } = this.props;
    const numSelected = selectedFiles.length;

    let content = null;

    switch (numSelected) {
      case 0:
        content = this.renderWithNoSelection();
        break;

      case 1:
        content = this.renderWithOneSelectedFile();
        break;

      default:
        content = this.renderWithSeveralSelectedFiles();
        break;
    }

    return (
      <div className={css.root}>
        {content}

        <Dialog
          aria-labelledby="new-folder-title"
          open={this.state.newFolderDialogOpen}
          onClose={this.handleToggleNewFolderDialog}
        >
          <DialogTitle id="new-folder-title">New Folder</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="folder-name"
              label="Folder Name"
              type="text"
              fullWidth
              onKeyPress={this.handleKeypressNewFolderName}
              onChange={this.handleChangeNewFolderName}
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="cancel"
              onClick={this.handleToggleNewFolderDialog}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={this.handleCreateNewFolder}
              color="primary"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          aria-labelledby="new-file-title"
          open={this.state.newFileDialogOpen}
          onClose={this.handleToggleNewFileDialog}
        >
          <DialogTitle id="new-file-title">New Schedule</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="file-name"
              label="File Name"
              type="text"
              fullWidth
              onKeyPress={this.handleKeypressNewFileName}
              onChange={this.handleChangeNewFileName}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleToggleNewFileDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleCreateNewFile} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.moveFileDialogOpen}
          onClose={this.handleToggleMoveFileDialog}
        >
          <MoveFileModal onClose={this.handleToggleMoveFileDialog} />
        </Dialog>

        <Dialog
          open={this.state.renameFileDialogOpen}
          onClose={this.handleToggleRenameFileDialog}
        >
          <RenameFileModal
            file={this.props.selectedFiles[0]}
            onClose={this.handleToggleRenameFileDialog}
          />
        </Dialog>

        <Dialog
          open={this.state.shareFileDialogOpen}
          onClose={this.handleToggleShareFileDialog}
        >
          <ShareFileModal
            file={this.props.selectedFiles[0]}
            onClose={this.handleToggleShareFileDialog}
          />
        </Dialog>
      </div>
    );
  }
}
