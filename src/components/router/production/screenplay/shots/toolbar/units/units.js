// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { type Node, PureComponent } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import SelectedIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import DropDownIcon from "@material-ui/icons/KeyboardArrowDown";
import CancelIcon from "@material-ui/icons/Cancel";
import ConfirmIcon from "@material-ui/icons/KeyboardArrowRight";
import unitPickerIcon from "static/images/unit-picker.svg";
import css from "./units.style.css";
import classNames from "classnames";
import type { Unit } from "src/redux/modules/units";
import type { Props } from "./";

type State = {
  open: boolean,
  newUnitField: boolean,
  newUnitName: string,
  anchorEl: Node
};

export default class UnitsMenuComponent extends PureComponent<Props, State> {
  target: ?HTMLElement;

  state: State = {
    open: false,
    newUnitField: false,
    newUnitName: "",
    anchorEl: null
  };

  // handleToggle = () => {
  //   this.setState((state: State) => ({
  //     open: !state.open,
  //     newUnitField: !!state.newUnitName
  //   }));
  // };

  handleToggle = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = (e: Event) => {
    if (e.target instanceof HTMLElement) {
      if (this.target && this.target.contains(e.target)) {
        return;
      }
    }

    this.setState((state: State) => ({
      open: false,
      newUnitField: !!state.newUnitName
    }));
  };

  handleSelect = (e: Event, u: Unit) => {
    const { selectedUnit } = this.props;
    this.props.selectUnit(
      selectedUnit && u.id === selectedUnit.id ? null : u.id
    );
    this.handleClose();
  };

  handleDelete = (e: Event, u: Unit) => {
    e.stopPropagation();
    const { productionId } = this.props;
    if (productionId) {
      this.props.deleteUnit(parseInt(productionId, 10), u.id);
    }
  };

  handleNewUnitKeyUp = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement) {
      switch (e.key) {
        case "Enter":
          this.handleCreate();
          break;
        default:
          this.setState({ newUnitName: e.target.value });
          break;
      }
    }
  };

  handleCancel = (e: Event) => {
    e.stopPropagation();
    this.setState({ newUnitName: "", newUnitField: false });
  };

  handleSubmit = (e: Event) => {
    e.stopPropagation();
    this.handleCreate();
  };

  handleCreate = () => {
    const { productionId } = this.props;
    const { newUnitName } = this.state;
    if (productionId) {
      this.props.createUnit(parseInt(productionId, 10), newUnitName);
      this.setState({ newUnitName: "", newUnitField: false });
    }
  };

  toggleNewUnitField = (e: Event) => {
    this.setState({ newUnitField: true });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  render() {
    const { selectedUnit, units } = this.props;
    const { open, newUnitField, newUnitName, anchorEl } = this.state;

    return (
      <div className={css.root}>
        <div>
          <div
            ref={node => {
              this.target = node;
            }}
          >
            <Button
              aria-owns={open ? "units-menu-list-grow" : null}
              aria-haspopup="true"
              onClick={this.handleToggle}
              classes={{
                root: css.buttonUnit
              }}
            >
              <span className={css.buttonTitle}>
                {selectedUnit ? selectedUnit.name : "Unit"}
              </span>
              <img
                src={unitPickerIcon}
                alt={"units"}
                className={css.unitPickerIcon}
              />
              <span className={css.buttonTitle}>{units.length}</span>
              <DropDownIcon className={css.dropDownIcon} />
            </Button>
            <Menu
              id="filter"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => this.handleClose()}
            >
              {units.map(u => (
                <MenuItem
                  key={u.id}
                  onClick={(e: Event) => this.handleSelect(e, u)}
                  className={classNames({
                    [css.menuItem]: true,
                    [css.unitSelected]: selectedUnit && selectedUnit.id === u.id
                  })}
                >
                  <div className={css.unitGutterLeft}>
                    {selectedUnit &&
                      selectedUnit.id === u.id && (
                        <SelectedIcon className={css.gutterIcon} />
                      )}
                  </div>
                  <div className={css.unitTitle}>{u.name}</div>
                  <div className={css.unitGutterRight}>
                    <DeleteIcon
                      onClick={(e: Event) => this.handleDelete(e, u)}
                      className={css.gutterIcon}
                    />
                  </div>
                </MenuItem>
              ))}
              <Divider key={"divider"} />
              <MenuItem
                key={"new_item"}
                onClick={(e: Event) => this.toggleNewUnitField(e)}
                className={classNames({
                  [css.newUnitMenuItem]: true,
                  [css.menuItem]: true
                })}
              >
                <div className={css.unitGutterLeft}>
                  {!newUnitField && <AddIcon className={css.gutterIcon} />}
                  {newUnitField && (
                    <CancelIcon
                      className={css.gutterIcon}
                      onClick={this.handleCancel}
                    />
                  )}
                </div>
                <div className={css.unitTitle}>
                  {!newUnitField && <span>New Unit</span>}
                  {newUnitField && (
                    <input
                      type="text"
                      className={css.newUnitInput}
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus
                      defaultValue={newUnitName}
                      onKeyUp={e => this.handleNewUnitKeyUp(e)}
                    />
                  )}
                </div>
                <div className={css.unitGutterRight}>
                  {newUnitField && (
                    <ConfirmIcon
                      className={css.gutterIcon}
                      onClick={this.handleSubmit}
                    />
                  )}
                </div>
              </MenuItem>
            </Menu>
          </div>
        </div>
        {/* <Popper
            placement="bottom-start"
            eventsEnabled={open}
            className={classNames({
              [css.popperClose]: !open
            })}
          > */}
        {/* <ClickAwayListener onClickAway={this.handleClose}>
              <Grow
                in={open}
                id="units-menu-list-grow"
                style={{ transformOrigin: "0 0 0" }}
              >
                <Paper className={css.menu}>
                  <MenuList role="menu">
                    {units.map(u => (
                      <MenuItem
                        key={u.id}
                        onClick={(e: Event) => this.handleSelect(e, u)}
                        className={classNames({
                          [css.menuItem]: true,
                          [css.unitSelected]:
                            selectedUnit && selectedUnit.id === u.id
                        })}
                      >
                        <div className={css.unitGutterLeft}>
                          {selectedUnit &&
                            selectedUnit.id === u.id && (
                              <SelectedIcon className={css.gutterIcon} />
                            )}
                        </div>
                        <div className={css.unitTitle}>{u.name}</div>
                        <div className={css.unitGutterRight}>
                          <DeleteIcon
                            onClick={(e: Event) => this.handleDelete(e, u)}
                            className={css.gutterIcon}
                          />
                        </div>
                      </MenuItem>
                    ))}

                    <Divider key={"divider"} />

                    <MenuItem
                      key={"new_item"}
                      onClick={(e: Event) => this.toggleNewUnitField(e)}
                      className={classNames({
                        [css.newUnitMenuItem]: true,
                        [css.menuItem]: true
                      })}
                    >
                      <div className={css.unitGutterLeft}>
                        {!newUnitField && (
                          <AddIcon className={css.gutterIcon} />
                        )}
                        {newUnitField && (
                          <CancelIcon
                            className={css.gutterIcon}
                            onClick={this.handleCancel}
                          />
                        )}
                      </div>
                      <div className={css.unitTitle}>
                        {!newUnitField && <span>New Unit</span>}
                        {newUnitField && (
                          <input
                            type="text"
                            className={css.newUnitInput}
                            // eslint-disable-next-line jsx-a11y/no-autofocus
                            autoFocus
                            defaultValue={newUnitName}
                            onKeyUp={e => this.handleNewUnitKeyUp(e)}
                          />
                        )}
                      </div>
                      <div className={css.unitGutterRight}>
                        {newUnitField && (
                          <ConfirmIcon
                            className={css.gutterIcon}
                            onClick={this.handleSubmit}
                          />
                        )}
                      </div>
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener> */}
        {/* </Popper> */}
      </div>
    );
  }
}
