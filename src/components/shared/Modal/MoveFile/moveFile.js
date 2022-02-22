// @flow
/* eslint-disable import/no-extraneous-dependencies,class-methods-use-this, no-param-reassign */
import React, { Component, Fragment } from "react";
import type { Props } from "./";
import { remove, map, includes } from "lodash";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import FolderIcon from "static/images/folderIcon.svg";
import defaultImage from "static/images/movie_cover.png";
import css from "./moveFile.style.css";

import type { Production } from "src/redux/modules/productions";

type State = {
  foldersOpen: Array<string>,
  selectedFolder: ?string,
  selectingProduction: boolean
};

class MoveFiles extends Component<Props, State> {
  state = {
    foldersOpen: [],
    selectedFolder: null,
    selectingProduction: false
  };

  componentDidMount = () => {
    const {
      isFirstLevelFetched,
      fetchFolderContent,
      productionId
    } = this.props;
    if (!isFirstLevelFetched) fetchFolderContent(productionId, "");
  };

  componentWillReceiveProps(nextProps: Props) {
    const { productionId } = this.props;
    const { productionId: nextProductionId, isFirstLevelFetched } = nextProps;
    if (productionId !== nextProductionId) {
      this.props.selectProductionToMove(nextProductionId);
      if (!isFirstLevelFetched) {
        this.props.fetchFolderContent(nextProductionId, "");
      }
    }
  }

  getNames = () => {
    const { selectedFiles } = this.props;

    return selectedFiles.length > 0
      ? selectedFiles
          .reduce((files, file) => (files += `${file.name},`), "")
          .slice(0, -1)
      : null;
  };

  expandFolder = (id: string, fetched: boolean) => {
    const { productionToMove, productionId } = this.props;
    const foldersOpen = [...this.state.foldersOpen];

    if (!includes(foldersOpen, id)) {
      foldersOpen.push(id);
    } else {
      remove(foldersOpen, item => item === id);
    }

    if (!fetched) {
      this.props.fetchFolderContent(productionToMove || productionId, id);
    }

    this.setState({
      foldersOpen
    });
  };

  selectFolder = (id: string) => {
    this.setState({
      selectedFolder: this.state.selectedFolder !== id ? id : null
    });
  };

  moveFile = () => {
    const {
      productionToMove,
      selectedFiles,
      moveFiles,
      onClose,
      productionId
    } = this.props;
    const { selectedFolder } = this.state;

    moveFiles(
      productionToMove || productionId,
      map(selectedFiles, "id"),
      selectedFolder
    );

    onClose();
  };

  handleProductionClick = () => {
    this.setState({
      selectingProduction: !this.state.selectingProduction
    });
  };

  selectProduction = (production: Production) => {
    this.props.fetchFolderContent(production.id, "");
    this.props.selectProductionToMove(production.id);

    this.setState({
      selectingProduction: false
    });
  };

  renderFilesFolder = () => (
    <div className={css.folder}>
      <button
        className={`${css.folderName} ${
          this.state.selectedFolder === "" ? css.selected : ""
        }`}
        onClick={() => this.selectFolder("")}
      >
        <img src={FolderIcon} className={css.fileIcon} alt={"Files"} />
        <span className={css.fileName}>Files</span>
      </button>
    </div>
  );

  renderFolders = (folders: Object) => {
    const { fetchedFolders } = this.props;
    const { selectedFolder } = this.state;

    return map(folders, folder => {
      const expanded = includes(this.state.foldersOpen, folder.id);
      const fetched = includes(fetchedFolders, folder.id);

      const showIcon = (fetched && folder.subFolders) || !fetched;

      let icon = null;

      if (showIcon) {
        icon = expanded ? (
          <RemoveIcon className={css.expandIcon} />
        ) : (
          <AddIcon className={css.expandIcon} />
        );
      }

      return (
        <React.Fragment key={folder.id}>
          <div className={css.folder}>
            <button
              onClick={() => this.expandFolder(folder.id, fetched)}
              className={icon ? css.iconContainer : null}
            >
              {icon}
            </button>
            <button
              className={`${css.folderName} ${
                selectedFolder === folder.id ? css.selected : ""
              } ${!icon ? css.margin : ""}`}
              onClick={() => this.selectFolder(folder.id)}
            >
              <img
                src={FolderIcon}
                className={css.fileIcon}
                alt={folder.name}
              />
              <span className={css.fileName}>{folder.name}</span>
            </button>
          </div>
          {folder.subFolders && (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <div className={css.margin}>
                {this.renderFolders(folder.subFolders)}
              </div>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  renderProductionPoster = (production: ?Production) =>
    production && production.poster ? (
      <img
        src={production.poster.urls[0]}
        alt="production"
        onError={e => {
          e.target.src = defaultImage;
        }}
        className={css.poster}
      />
    ) : (
      <div className={css.noPoster} />
    );

  renderProductions = () => {
    const { productions, productionToMove } = this.props;

    return (
      productions &&
      productions.map(production => (
        <div
          key={production.id}
          className={`${css.production} ${
            productionToMove === production.id ? css.selected : ""
          }`}
        >
          <button
            className={css.productionContent}
            onClick={() => this.selectProduction(production)}
          >
            <span className={css.productionPoster}>
              {this.renderProductionPoster(production)}
            </span>
            <span>{production.name}</span>
          </button>
        </div>
      ))
    );
  };

  render() {
    const { onClose, folders, production } = this.props;
    const { selectedFolder, selectingProduction } = this.state;

    return (
      <Paper className={css.modalContainer} square>
        <div className={css.header}>
          <span>Move {this.getNames()} to...</span>
          <button
            onClick={this.handleProductionClick}
            className={css.productionButton}
          >
            {this.renderProductionPoster(production)}
          </button>
        </div>
        <div className={css.content}>
          {selectingProduction ? (
            <div className={css.productions}>{this.renderProductions()}</div>
          ) : (
            <Fragment>
              {this.renderFilesFolder()}
              {this.renderFolders(folders)}
            </Fragment>
          )}
        </div>
        <div className={css.footer}>
          <Button
            color="primary"
            variant="contained"
            classes={{
              root: css.buttonCancel,
              label: css.buttonLabelCancel
            }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={selectedFolder !== "" && !selectedFolder}
            onClick={this.moveFile}
            classes={{
              root: css.buttonMove,
              label: css.buttonLabelMove,
              disabled: css.buttonDisabled
            }}
          >
            Move
          </Button>
        </div>
      </Paper>
    );
  }
}

export default MoveFiles;
