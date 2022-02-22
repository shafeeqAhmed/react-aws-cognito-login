// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent, type Node } from "react";
import { get, pickBy, map } from "lodash";
import css from "./toolbar.style.css";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import NewMenuItem from "@material-ui/core/MenuItem";

// Shared
import imgPrint from "static/images/print.png";
import imgNewScene from "static/images/newScene.png";
import ArrowDownIcon from "@material-ui/icons/ArrowDropDown";

// Script editor
import imgShowScene from "static/images/sceneShow.png";
import imgHideScene from "static/images/sceneHide.png";
import imgDeleteScene from "static/images/deleteScene.png";
import imgSpellCheck from "static/images/spellCheck.png";
import imgImportScene from "static/images/importScene.png";
import imgBold from "static/images/bold.png";
import imgUnderline from "static/images/underline.png";
import imgItalic from "static/images/itallic.png";
import imgPublished from "static/images/published.png";
import imgScriptchat from "static/images/scriptchat.png";
import imgWrite from "static/images/write.png";
import UndoIcon from "@material-ui/icons/Undo";
import imgLockIcon from "static/images/locked-white.png";

// Call sheet
import imgUnit from "static/images/contextMenuUnitIcon.svg";

import vars from "config/variables";
import { LineClasses } from "src/redux/modules/screenplay";
import SearchBar from "./searchbar";
import StripboardSearchBar from "./StripboardSearchBar";
import { type Props } from "./";

const SPELLCHECK = "SPELLCHECK";
const PRINT = "PRINT";
const NEW_SCENE = "NEW_SCENE";
const DELETE = "DELETE";
const IMPORT = "IMPORT";

type State = {
  selectedTool: string
};

export default class Toolbar extends PureComponent<Props, State> {
  state = {
    selectedTool: SPELLCHECK
  };

  constructor(props: Props) {
    super(props);
    window.onafterprint = () => this.setState({ selectedTool: SPELLCHECK });
  }

  deleteScene = () => {
    // TODO: find a better abstraction to share toolbar and types
    if (this.props.type !== "editor") return;

    const { selectedScene, deleteScene, omitScene } = this.props;
    if (!selectedScene) return;

    if (!selectedScene.sceneLocked) {
      deleteScene(selectedScene);
      return;
    }

    if (selectedScene.sceneLocked && !selectedScene.sceneOmitted) {
      omitScene(selectedScene);
    }
  };

  searchInput: ?HTMLInputElement;

  search = (
    q: string,
    { shiftKey, target }: SyntheticKeyboardEvent<HTMLInputElement>
  ) => {
    this.props.search(q, shiftKey, false);
    if (!(target instanceof HTMLInputElement)) return;
    target.select();
    target.focus();
  };

  replace = (q: string, replacement: string, all: boolean) => {
    // TODO: find a better abstraction to share toolbar and types
    if (this.props.type !== "editor") return;
    this.props.replace(q, replacement, all);
  };

  clearSearch = () => {
    this.props.clearSearch();
  };

  printDocument = () => {
    // TODO: find a better abstraction to share toolbar and types
    if (this.props.type === "editor") {
      this.props.printScreenplay();
    } else {
      this.setState({ selectedTool: PRINT }, () => window.print());
    }
  };

  selectUnit = (event: SyntheticEvent<HTMLInputElement>) => {
    if (this.props.type !== "stripboard") return;
    const target: HTMLInputElement = (event.target: any);
    target.value &&
      typeof target.value === "string" &&
      this.props.selectUnit(target.value);
  };

  getToolStyle = (name: string) => {
    if (name === this.state.selectedTool)
      return `${css.buttonToolbar} ${css.buttonToolbarSelected}`;

    return `${css.buttonToolbar}`;
  };

  // TODO: perhaps view-specific tooling can be broken up more modularly later
  //
  //
  renderLeftAction = (): Node => {
    // TODO: find a better abstraction to share toolbar and types
    if (this.props.type === "editor")
      return (
        <Button onClick={this.props.collapseScenes} className={css.scenes}>
          <img
            alt=""
            className={css.imgArrowsInsideGray}
            src={this.props.areScenesCollapsed ? imgShowScene : imgHideScene}
          />
        </Button>
      );

    if (this.props.type === "stripboard")
      return (
        <Select
          className={css.unitSelect}
          classes={{ root: css.unitSelectRoot }}
          disableUnderline
          value={this.props.currentUnitId}
          onChange={this.selectUnit}
          IconComponent={() => (
            <ArrowDownIcon classes={{ root: css.unitSelectIconRoot }} />
          )}
          renderValue={value => {
            const unit = this.props.unitList.filter(u => u.id === value)[0];
            const label = get(unit, "name", get(unit, "id", ""));
            return (
              <React.Fragment>
                <img alt="" className={css.imgUnit} src={imgUnit} />
                {label}
              </React.Fragment>
            );
          }}
        >
          {this.props.unitList.map(unit => (
            <NewMenuItem key={unit.id} value={unit.id}>
              {unit.name}
            </NewMenuItem>
          ))}
        </Select>
      );

    return null;
  };

  renderDelete = (): Node => {
    // TODO: find a better abstraction to share toolbar and types
    if (this.props.type === "editor")
      return (
        <Button
          title="Delete Scene"
          className={this.getToolStyle(DELETE)}
          onClick={this.deleteScene}
        >
          <img alt="" className={css.imgTools} src={imgDeleteScene} />
        </Button>
      );

    return null;
  };

  renderLockScriptButton = () => {
    if (this.props.type !== "editor") return null;

    const { lockScenes } = this.props;

    return (
      <Button
        variant="raised"
        className={css.lockButton}
        onClick={(_: SyntheticEvent<HTMLElement>) => lockScenes()}
      >
        <img alt="" className={css.imgLock} src={imgLockIcon} />
        Lock Script
      </Button>
    );
  };

  renderEditorTools = (): Node => {
    if (this.props.type !== "editor") return null;

    const {
      changeLineClass,
      cursor,
      toggleBold,
      toggleItalic,
      toggleUnderline,
      toggleSpellChecker,
      undo
    } = this.props;
    const lineClasses = pickBy(LineClasses, lc => lc !== LineClasses.None);

    return (
      <React.Fragment>
        <div className={css.lineClassContainer}>
          <Button
            onClick={(_: SyntheticEvent<>) => toggleSpellChecker()}
            className={this.getToolStyle(SPELLCHECK)}
          >
            <img alt="" className={css.imgTools} src={imgSpellCheck} />
          </Button>
          <Button className={this.getToolStyle(IMPORT)}>
            <img alt="" className={css.imgTools} src={imgImportScene} />
          </Button>
          <SelectField
            dropDownMenuProps={{
              iconButton: <ArrowDownIcon />
            }}
            style={{
              alignItems: "center",
              height: 35,
              width: 200,
              borderRadius: "35px",
              border: "2px solid",
              borderColor: vars.colorBlueTwo,
              backgroundColor: vars.colorBlueTwoFaded
            }}
            labelStyle={{
              display: "flex",
              alignItems: "center",
              top: 0,
              height: 30,
              paddingLeft: 20,
              fontWeight: "bold",
              color: vars.colorBlueDark
            }}
            iconStyle={{
              top: 0,
              height: 30,
              padding: 0
            }}
            underlineStyle={{
              borderBottom: 0
            }}
            selectedMenuItemStyle={{
              color: vars.colorBlueDark
            }}
            value={cursor.lineClass || "none"}
            onChange={(event, index, value) => changeLineClass(value)}
          >
            <MenuItem value={"none"} primaryText="No format" />
            {map(lineClasses, (v, k) => (
              <MenuItem key={v} value={v} primaryText={k} />
            ))}
          </SelectField>
        </div>
        <div className={css.optionText}>
          <Button
            className={`${css.buttonToolbar} ${css.buttonFontTools}`}
            onClick={(_: SyntheticEvent<>) => toggleBold()}
          >
            <img alt="" className={css.imgTools} src={imgBold} />
          </Button>
          <Button
            className={`${css.buttonToolbar} ${css.buttonFontTools}`}
            onClick={(_: SyntheticEvent<>) => toggleItalic()}
          >
            <img alt="" className={css.imgTools} src={imgItalic} />
          </Button>
          <Button
            className={`${css.buttonToolbar} ${css.buttonFontTools}`}
            onClick={(_: SyntheticEvent<>) => toggleUnderline()}
          >
            <img alt="" className={css.imgTools} src={imgUnderline} />
          </Button>

          <Button
            className={`${css.buttonToolbar} ${css.buttonFontTools}`}
            onClick={(_: SyntheticEvent<>) => undo()}
          >
            <UndoIcon style={{ color: vars.colorGrayDove }} />
          </Button>
        </div>
      </React.Fragment>
    );
  };

  renderSearchBar = (): Node => {
    // TODO: find a better abstraction to share toolbar and types
    if (this.props.type === "editor")
      return (
        <SearchBar
          onRequestSearch={this.search}
          onRequestReplacement={this.replace}
          onClear={this.clearSearch}
          searchPosition={this.props.searchPosition}
          placeholder="Search Script"
        />
      );

    if (this.props.type === "stripboard") return <StripboardSearchBar />;

    return null;
  };

  renderToggleButtons = (): Node => {
    // TODO: find a better abstraction to share toolbar and types
    if (this.props.type === "editor")
      return (
        <React.Fragment>
          <button className={css.buttonWriteSelect}>
            <img alt="" className={css.imgWrite} src={imgWrite} />
          </button>
          <button className={css.buttonWriteSelect}>
            <img alt="" className={css.imgWrite} src={imgScriptchat} />
          </button>
        </React.Fragment>
      );

    return null;
  };

  render() {
    const { publishChanges, createNew, createNewAltText } = this.props;

    return (
      <div className={css.toolbar}>
        <div className={css.iconToolsContainer}>
          <div className={css.iconToolsLeftContainer}>
            <div className={css.iconWithTextContainer}>
              {this.renderLeftAction()}
            </div>

            <div className={css.iconWithTextContainer}>
              <Button
                className={this.getToolStyle(NEW_SCENE)}
                onClick={(_: SyntheticEvent<>) => createNew()}
                title={createNewAltText}
              >
                <img alt="" className={css.imgTools} src={imgNewScene} />
              </Button>

              {this.renderDelete()}

              <Button
                title="Print"
                onClick={this.printDocument}
                className={this.getToolStyle(PRINT)}
              >
                <img alt="" className={css.imgTools} src={imgPrint} />
              </Button>
            </div>

            {this.renderEditorTools()}
            {this.renderLockScriptButton()}
          </div>

          <div className={css.iconToolsRightContainer}>
            <div className={css.iconWithTextContainer}>
              <Button
                className={css.publish}
                onClick={(_: SyntheticEvent<>) => publishChanges()}
              >
                <div className={css.publishTitle}>
                  <img
                    alt=""
                    className={css.imgToolsRight}
                    src={imgPublished}
                  />
                </div>
              </Button>
              {/* <div className={css.buttonWriteContainer}>
                {this.renderToggleButtons()}
              </div> */}

              {this.renderSearchBar()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
