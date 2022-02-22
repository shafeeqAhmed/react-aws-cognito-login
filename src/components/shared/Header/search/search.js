// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { debounce, get } from "lodash";
import Downshift from "downshift";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import FolderIcon from "static/images/folderIcon.svg";
import ScreenplayIcon from "static/images/screenplayIcon.svg";
import css from "./search.style.css";
import type { Props } from "./";
import type { File } from "src/redux/modules/drive";
import { FileTypes } from "src/redux/modules/drive";

type State = {
  collapsed: boolean
};

export default class Search extends PureComponent<Props, State> {
  state: State = {
    collapsed: true
  };

  handleChange = (selectedItem: ?File) => {
    const { history, production } = this.props;
    if (!selectedItem) return;

    console.log("selectedItem", selectedItem);

    switch (selectedItem.fileType) {
      case FileTypes.FOLDER:
        history.push(`/${get(production, "id", 0)}/drive/${selectedItem.id}`);
        break;

      case FileTypes.SCREENPLAY:
        history.push(`/${get(production, "id", 0)}/drive/s/${selectedItem.id}`);
        break;

      case FileTypes.UPLOAD:
        // TODO: select item
        history.push(
          `/${get(production, "id", 0)}/drive/${get(
            selectedItem,
            "folderId",
            ""
          )}`
        );
        break;

      default:
      // nothing
    }

    this.collapse();
  };

  handleStateChange = (change: { type: string, inputValue?: string }) => {
    const { clearSearch, search, production } = this.props;
    const { inputValue, type } = change;
    const find = debounce(search, 150);

    if (type !== Downshift.stateChangeTypes.changeInput) return;

    if (!inputValue) {
      clearSearch();
      return;
    }

    find(get(production, "id", 0), inputValue);
  };

  expand = () => {
    this.setState({ collapsed: false });
  };

  collapse = () => {
    this.setState({ collapsed: true });
  };

  renderCloseButton() {
    return (
      <InputAdornment
        position="end"
        classes={{
          root: css.closeIconAdornment
        }}
      >
        <IconButton
          aria-label="Toggle password visibility"
          onClick={this.collapse}
          className={css.closeButton}
        >
          <CloseIcon className={css.closeIcon} />
        </IconButton>
      </InputAdornment>
    );
  }

  render() {
    const { query, suggestions } = this.props;
    const { collapsed } = this.state;

    return collapsed ? (
      <IconButton onClick={this.expand}>
        <SearchIcon className={css.searchIcon} />
      </IconButton>
    ) : (
      <ClickAwayListener onClickAway={this.collapse}>
        <Downshift
          id="search-downshift"
          itemToString={() => query}
          onStateChange={this.handleStateChange}
          onChange={this.handleChange}
          selectedItem={null}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            isOpen,
            inputValue,
            selectedItem,
            highlightedIndex
          }) => (
            <div className={css.container}>
              <TextField
                InputProps={getInputProps({
                  disableUnderline: true,
                  endAdornment: this.renderCloseButton(),
                  classes: {
                    root: css.inputRoot,
                    input: css.input
                  }
                })}
                autoFocus
                fullWidth
                placeholder="Search"
                value={inputValue}
                classes={{
                  root: css.textField
                }}
              />
              <div {...getMenuProps()} className={css.menu}>
                {isOpen ? (
                  <Paper className={css.paper} square>
                    {suggestions.map((file: File, index: number) =>
                      renderSuggestion(
                        file,
                        index,
                        getItemProps({ item: file, key: file.id }),
                        highlightedIndex,
                        selectedItem
                      )
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
      </ClickAwayListener>
    );
  }
}

function renderSuggestion(
  suggestion: File,
  index: number,
  itemProps: Object,
  highlightedIndex: number,
  selectedItem: ?File
) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = get(selectedItem, "id", "") === suggestion.id;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.id}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {renderFileIcon(suggestion)}
      <span className={css.fileName}>{suggestion.name}</span>
    </MenuItem>
  );
}

function renderFileIcon(file: File) {
  switch (file.fileType) {
    case FileTypes.FOLDER:
      return <img src={FolderIcon} className={css.fileIcon} alt={file.name} />;
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
