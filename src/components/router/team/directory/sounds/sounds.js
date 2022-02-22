/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React, { createRef, PureComponent } from "react";
import { get, uniq } from "lodash";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import classnames from "classnames";
import Navbar from "src/components/shared/Navbar";
import Sidebar from "./sidebar";
import Table from "./table";
import NewSoundDrawer from "./SoundDrawer";
import type { Props } from "./";
import css from "./sounds.styles.css";
import ChevronIcon from "@material-ui/icons/ChevronRight";

type State = {|
  searchFocused: boolean,
  newSoundOpen: boolean,
  moreMenuOpen: boolean,
  selectedSoundIds: Array<string>
|};

export default class Sounds extends PureComponent<Props, State> {
  moreButtonRef: any = createRef();

  state: State = {
    searchFocused: false,
    newSoundOpen: false,
    moreMenuOpen: false,
    selectedSoundIds: []
  };

  select = (ids: Array<string>) => {
    this.setState(state => ({
      selectedSoundIds: uniq([...state.selectedSoundIds, ...ids])
    }));
  };

  unselect = (ids: Array<string>) => {
    this.setState(state => ({
      selectedSoundIds: state.selectedSoundIds.filter(id => !ids.includes(id))
    }));
  };

  resetSelection = () => {
    this.setState(state => ({
      selectedSoundIds: state.selectedSoundIds.filter(id => false)
    }));
  };

  componentDidMount() {
    const { teamId } = this.props.match.params;
    this.props.fetchTeams();
    this.props.setActiveTeam({ teamId });
  }

  onFocusSearch = () => {
    this.setState({
      searchFocused: true
    });
  };

  onBlurSearch = () => {
    this.setState({
      searchFocused: false
    });
  };

  onClickNewSound = () => {
    this.setState({
      newSoundOpen: true
    });
  };

  closeNewSoundDrawer = () => {
    this.setState({
      newSoundOpen: false
    });
  };

  onClickMore = () => {
    this.setState(state => ({
      moreMenuOpen: !state.moreMenuOpen
    }));
  };

  onCloseMore = (e?: Event) => {
    const target = get(e, "target");
    const ref = this.moreButtonRef.current;

    if (e && target && ref && ref.contains(target)) {
      return;
    }

    this.setState({ moreMenuOpen: false });
  };

  onClickDeleteSelection = () => {
    const { deleteSound, team } = this.props;
    const { selectedSoundIds } = this.state;

    selectedSoundIds.forEach(soundId =>
      deleteSound({
        teamId: team.id,
        soundId
      })
    );

    this.onCloseMore();
  };

  onClickDownload = () => {
    const { getDownloadUrl, team } = this.props;
    const { selectedSoundIds } = this.state;

    getDownloadUrl({
      teamId: team.id,
      soundIds: selectedSoundIds
    });

    this.onCloseMore();
  };

  onChangeUploadInput = (e: Event) => {
    const files = get(e, "currentTarget.files", []);
    const { uploadSound, team } = this.props;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      uploadSound({
        teamId: team.id,
        blob: file,
        name: file.name,
        fileName: file.name
      });
    }
  };

  render() {
    const {
      selectedSoundIds,
      moreMenuOpen,
      newSoundOpen,
      searchFocused
    } = this.state;
    const { search } = this.props;

    return (
      <div className={css.root}>
        <Navbar active="directory" />
        <div className={css.content}>
          <Sidebar />

          <div className={css.mainContentArea}>
            <div className={css.mainContentHeader}>
              <div className={css.mainContentTitle}>All Sounds</div>
            </div>

            <Toolbar classes={{ root: css.mainContentToolbar }}>
              <div
                className={classnames({
                  [css.search]: true,
                  [css.searchFocus]: !!searchFocused || !!search.query.term
                })}
              >
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: css.searchInputRoot,
                    input: css.searchInputInput
                  }}
                  onFocus={this.onFocusSearch}
                  onBlur={this.onBlurSearch}
                />
              </div>

              <div className={css.grow} />

              <Button
                buttonRef={this.moreButtonRef}
                variant="outlined"
                color="primary"
                onClick={this.onClickMore}
                aria-owns={moreMenuOpen ? "menu-list-grow" : undefined}
                aria-haspopup="true"
                classes={{
                  root: css.moreButton,
                  label: css.moreButtonLabel
                }}
              >
                More
                <ChevronIcon
                  className={classnames({
                    [css.moreChevronIcon]: true,
                    [css.moreChevronIconOpen]: moreMenuOpen,
                    [css.moreChevronIconClosed]: !moreMenuOpen
                  })}
                />
              </Button>
              <Popper
                open={moreMenuOpen}
                anchorEl={this.moreButtonRef.current}
                transition
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    id="menu-list-grow"
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom"
                    }}
                  >
                    <Paper className={css.moreMenuPaper}>
                      <ClickAwayListener onClickAway={this.onCloseMore}>
                        <MenuList>
                          {selectedSoundIds.length ? (
                            <MenuItem onClick={this.onClickDownload}>
                              Download
                            </MenuItem>
                          ) : null}

                          {selectedSoundIds.length ? (
                            <MenuItem onClick={this.onClickDeleteSelection}>
                              Delete
                            </MenuItem>
                          ) : null}

                          <MenuItem>
                            <label className={css.fileInputLabel}>
                              <span className={css.uploadText}>Upload</span>
                              <input
                                type="file"
                                multiple
                                className={css.fileInput}
                                onChange={this.onChangeUploadInput}
                              />
                            </label>
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>

              <Button
                variant="contained"
                color="primary"
                onClick={this.onClickNewSound}
                classes={{
                  root: css.newSoundButton,
                  label: css.newSoundButtonLabel
                }}
              >
                New Sound
              </Button>
            </Toolbar>

            <Table
              selectedRowIds={selectedSoundIds}
              select={this.select}
              unselect={this.unselect}
              resetSelection={this.resetSelection}
            />
          </div>
        </div>

        <NewSoundDrawer
          open={newSoundOpen}
          onClose={this.closeNewSoundDrawer}
        />
      </div>
    );
  }
}
