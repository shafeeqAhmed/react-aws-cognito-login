/* eslint-disable import/no-named-default */
/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React, { Fragment, PureComponent } from "react";
import Moment from "moment";
import { get, orderBy } from "lodash";
import { AutoSizer } from "react-virtualized";
import { default as ReactSound } from "react-sound";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MuiTable from "mui-virtualized-table";
import SoundWave from "src/components/shared/SoundWave";
import TagChip from "src/components/shared/Tag";
import NoSsr from "@material-ui/core/NoSsr";
import PlayIcon from "static/images/play.svg";
import PauseIcon from "static/images/pause.svg";
import PlusIcon from "static/images/plus.svg";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import type { Props } from "./";
import type { Sound } from "src/redux/modules/sounds";
import { TagTypes } from "src/redux/modules/tags";
import { ElementItemTypes, type Element } from "src/redux/modules/elements";
import DigitalRequirementDrawer from "../DigitalRequirementDrawer";
import css from "./table.style.css";

type State = {
  selectedRowIds: Array<string>,
  editing: ?Element,
  order: {
    by: string,
    direction: "asc" | "desc"
  },
  menu: {
    open: boolean,
    selected: ?string,
    anchor: ?any,
    rowData: ?Element
  },
  sounds: {
    [id: string]: {
      playStatus: $Keys<typeof ReactSound.status>,
      position?: number,
      duration?: number,
      loadStatus: "loading" | "success" | "error",
      playUrlRequested?: boolean
    }
  }
};

type SoundEvent = {
  duration?: number,
  position?: number,
  loaded?: boolean
};

export default class Table extends PureComponent<Props, State> {
  state: State = {
    selectedRowIds: [],
    editing: null,
    menu: {
      open: false,
      selected: null,
      anchor: null,
      rowData: null
    },
    order: {
      by: "team_order",
      direction: "asc"
    },
    sounds: {}
  };

  componentDidMount() {
    const {
      fetchTags,
      fetchElements,
      fetchSounds,
      category,
      production
    } = this.props;

    const teamId = get(production, "team.id");
    const categoryId = get(category, "id");
    const productionId = get(production, "id");

    if (teamId) {
      fetchTags({ teamId });
      fetchSounds({ teamId });
    }

    if (productionId && categoryId) {
      fetchElements({ productionId, categoryId });
    }
  }

  componentDidUpdate(prev: Props) {
    const { sounds } = this.props;
    sounds.forEach(sound => this.requestPlayUrl(sound));
  }

  requestPlayUrl = (sound: Sound) => {
    const { getPlayUrl, match } = this.props;
    const { sounds } = this.state;
    const { teamId } = match.params;

    const requested = get(sounds, `[${sound.id}].playUrlRequested`, false);
    if (requested || sound.play_url || !sound.version) return;

    getPlayUrl({ teamId, soundId: sound.id });

    this.setState(state => ({
      ...state,
      sounds: {
        ...state.sounds,
        [sound.id]: {
          ...get(state, `sounds[${sound.id}]`, {}),
          playUrlRequested: true
        }
      }
    }));
  };

  onClickPlus = (element: Element, e?: Event) => {
    // TODO: edit element to add sound items
  };

  onClickPlay = (sound: Sound, e?: Event) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.setState(state => ({
      ...state,
      sounds: {
        ...state.sounds,
        [sound.id]: {
          ...get(state, `sounds[${sound.id}]`, {}),
          playStatus:
            get(state, `sounds[${sound.id}].playStatus`) ===
            ReactSound.status.PLAYING
              ? ReactSound.status.PAUSED
              : ReactSound.status.PLAYING
        }
      }
    }));

    return false;
  };

  onLoadingSound = (sound: Sound, { duration }: SoundEvent) => {
    this.setState(state => ({
      ...state,
      sounds: {
        ...state.sounds,
        [sound.id]: {
          ...get(state, `sounds[${sound.id}]`, {}),
          loadStatus: "loading",
          duration
        }
      }
    }));
  };

  onLoadSound = (sound: Sound, { loaded }: SoundEvent) => {
    this.setState(state => ({
      ...state,
      sounds: {
        ...state.sounds,
        [sound.id]: {
          ...get(state, `sounds[${sound.id}]`, {}),
          loadStatus: loaded ? "success" : "error",
          playStatus: ReactSound.status.STOPPED
        }
      }
    }));
  };

  onPlayingSound = (sound: Sound, { position, duration }: SoundEvent) => {
    this.setState(state => ({
      ...state,
      sounds: {
        ...state.sounds,
        [sound.id]: {
          ...get(state, `sounds[${sound.id}]`, {}),
          position,
          duration
        }
      }
    }));
  };

  onPauseSound = (sound: Sound, { position, duration }: SoundEvent) => {
    this.setState(state => ({
      ...state,
      sounds: {
        ...state.sounds,
        [sound.id]: {
          ...get(state, `sounds[${sound.id}]`, {}),
          position,
          duration
        }
      }
    }));
  };

  onStoppedSound = (sound: Sound, { duration }: SoundEvent) => {
    this.setState(state => ({
      ...state,
      sounds: {
        ...state.sounds,
        [sound.id]: {
          ...get(state, `sounds[${sound.id}]`, {}),
          duration,
          position: 0
        }
      }
    }));
  };

  onResumeSound = (sound: Sound, { position, duration }: SoundEvent) => {
    this.setState(state => ({
      ...state,
      sounds: {
        ...state.sounds,
        [sound.id]: {
          ...get(state, `sounds[${sound.id}]`, {}),
          position,
          duration
        }
      }
    }));
  };

  onClickMenu = (rowData: Element, e: Event) => {
    const target = e.currentTarget || e.target;

    e.preventDefault();
    e.stopPropagation();

    this.setState(state => ({
      menu: {
        open: state.menu.rowData === rowData ? !state.menu.open : true,
        selected: null,
        anchor: target,
        rowData
      }
    }));
  };

  onClickEdit = (e: Event) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.setState(state => ({
      editing: state.menu.rowData,
      menu: {
        ...state.menu,
        open: false,
        selected: null
      }
    }));
  };

  onClickDelete = (e: Event) => {
    const { production, deleteElement } = this.props;
    const { menu } = this.state;

    deleteElement({
      productionId: production.id,
      elementId: get(menu, "rowData.id")
    });
  };

  render() {
    const { editing, menu, order, sounds, selectedRowIds } = this.state;
    const { elements: unsorted } = this.props;

    const data = orderBy(unsorted, order.by, order.direction);

    return (
      <Fragment>
        <AutoSizer>
          {({ width, height }) => (
            <MuiTable
              data={data}
              columns={[
                {
                  name: "checkbox",
                  header: (
                    <Checkbox
                      checked={selectedRowIds.length > 0}
                      onChange={e =>
                        this.setState(prevState => {
                          if (prevState.selectedRowIds.length === data.length) {
                            // deselect all
                            return { selectedRowIds: [] };
                          }

                          // select all
                          return { selectedRowIds: data.map(d => d.id) };
                        })
                      }
                      indeterminate={
                        selectedRowIds.length > 0 &&
                        selectedRowIds.length !== data.length
                      }
                      color={
                        selectedRowIds.length > 0 &&
                        selectedRowIds.length !== data.length
                          ? "default"
                          : "primary"
                      }
                    />
                  ),
                  cell: rowData => (
                    <Checkbox
                      checked={selectedRowIds.some(id => rowData.id === id)}
                    />
                  ),
                  cellProps: { style: { paddingRight: 0, paddingLeft: 0 } },
                  width: 60
                },
                {
                  name: "category_order",
                  header: "ID",
                  cellProps: { style: { paddingRight: 0, paddingLeft: 0 } },
                  cell: element => (
                    <span>
                      {typeof element.category_order === "undefined"
                        ? ""
                        : String(element.category_order).padStart(5, "0")}
                    </span>
                  ),
                  width: 50
                },
                {
                  name: "name",
                  header: "Requirement"
                },
                {
                  name: "duration",
                  header: "Time",
                  cellProps: { style: { paddingRight: 0, paddingLeft: 0 } },
                  width: 130,
                  cell: element => {
                    const item = element.items.find(
                      i => i.item_type === ElementItemTypes.SOUND
                    );

                    const noSound = (
                      <div className={css.timeCell}>
                        <SoundWave className={css.soundWave} progress={0} />
                        <span className={css.soundDuration}>--:--</span>
                        <IconButton
                          className={css.playSoundButton}
                          onClick={e => this.onClickPlus(element, e)}
                        >
                          <img
                            src={PlusIcon}
                            alt="add sound"
                            className={css.playSoundImage}
                          />
                        </IconButton>
                      </div>
                    );

                    if (!item) return noSound;

                    const sound = this.props.sounds.find(
                      s => s.id === item.item_id
                    );
                    if (!sound) return noSound;

                    const position = get(sounds[sound.id], "position", 0);
                    const duration = get(sounds[sound.id], "duration");
                    const progress = duration ? position / duration : 100;

                    return (
                      <div className={css.timeCell}>
                        {sound.play_url ? (
                          <NoSsr>
                            <ReactSound
                              url={sound.play_url}
                              onLoading={args =>
                                this.onLoadingSound(sound, args)
                              }
                              onLoad={args => this.onLoadSound(sound, args)}
                              onPlaying={args =>
                                this.onPlayingSound(sound, args)
                              }
                              onPause={args => this.onPauseSound(sound, args)}
                              onStopped={args =>
                                this.onStoppedSound(sound, args)
                              }
                              onResume={args => this.onResumeSound(sound, args)}
                              playStatus={get(
                                this.state,
                                `sounds[${sound.id}].playStatus`,
                                ReactSound.status.STOPPED
                              )}
                            />
                          </NoSsr>
                        ) : null}

                        <SoundWave
                          className={css.soundWave}
                          progress={progress}
                        />

                        <span className={css.soundDuration}>
                          {position || duration
                            ? Moment.utc(
                                sounds[sound.id].position ||
                                  sounds[sound.id].duration ||
                                  ""
                              ).format("mm:ss")
                            : "--:--"}
                        </span>

                        <IconButton
                          className={css.playSoundButton}
                          disabled={!sound.play_url}
                          onClick={e => this.onClickPlay(sound, e)}
                        >
                          <img
                            src={
                              get(sounds[sound.id], "playStatus") ===
                              ReactSound.status.PLAYING
                                ? PauseIcon
                                : PlayIcon
                            }
                            alt="play sound"
                            className={css.playSoundImage}
                          />
                        </IconButton>
                      </div>
                    );
                  }
                },
                {
                  name: "productions",
                  header: "Productions",
                  width: 100,
                  cell: rowData => {
                    let productionName = get(
                      rowData,
                      "productions[0].production.name",
                      ""
                    );

                    const productionCount = get(rowData, "productions", [])
                      .length;
                    if (productionName && productionCount > 1) {
                      productionName += ` + ${productionCount - 1}`;
                    }

                    return <span>{productionName}</span>;
                  }
                },
                {
                  name: "scenes",
                  header: "Scenes",
                  cell: rowData => (
                    <div className={css.scenes}>
                      {rowData.shootingevents_scenes.map(s => (
                        <span className={css.scene}>{s.scene_code}</span>
                      ))}
                    </div>
                  )
                },
                {
                  name: "tags",
                  header: "Production Groups",
                  cell: rowData => (
                    <div className={css.tags}>
                      {get(rowData, "tags", [])
                        .filter(t => t.tag_type === TagTypes.PRODUCTION_GROUP)
                        .map(t => (
                          <TagChip
                            classes={{ root: css.tagChip }}
                            key={t.id}
                            tag={t}
                          />
                        ))}
                    </div>
                  )
                },
                {
                  name: "menu",
                  header: " ",
                  cellProps: { style: { paddingRight: 0, paddingLeft: 0 } },
                  width: 50,
                  cell: sound => (
                    <div className={css.menuCell}>
                      <IconButton
                        className={css.rowMenuButton}
                        onClick={e => this.onClickMenu(sound, e)}
                      >
                        <MoreVertIcon className={css.menuIcon} />
                      </IconButton>
                    </div>
                  )
                }
              ]}
              includeHeaders
              fixedRowCount={1}
              width={width}
              height={height - 128}
              style={{ backgroundColor: "white" }}
              isCellSelected={(column, rowData) =>
                selectedRowIds.some(id => rowData && rowData.id === id)
              }
              isCellHovered={(column, rowData, hoveredColumn, hoveredRowData) =>
                rowData.id && rowData.id === hoveredRowData.id
              }
              orderBy={order.by}
              orderDirection={order.direction}
              onHeaderClick={({ name }) =>
                this.setState(state => ({
                  order: {
                    by: name,
                    direction:
                      // eslint-disable-next-line no-nested-ternary
                      state.order.by === name
                        ? state.order.direction === "desc"
                          ? "asc"
                          : "desc"
                        : "asc"
                  }
                }))
              }
              onCellClick={(column, rowData) => {
                this.setState(prevState => {
                  if (prevState.selectedRowIds.some(id => rowData.id === id)) {
                    // remove
                    return {
                      selectedRowIds: prevState.selectedRowIds.filter(
                        id => id !== rowData.id
                      )
                    };
                  }

                  // add
                  return {
                    selectedRowIds: [...prevState.selectedRowIds, rowData.id]
                  };
                });
              }}
            />
          )}
        </AutoSizer>

        <DigitalRequirementDrawer
          open={!!editing}
          element={editing}
          onClose={() =>
            this.setState({
              editing: null
            })
          }
        />

        <Menu
          id="elements-menu"
          anchorEl={menu.anchor}
          open={!!menu.open}
          onClose={() =>
            this.setState(state => ({ menu: { ...state.menu, open: false } }))
          }
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: 200
            }
          }}
        >
          <MenuItem
            key={"edit"}
            selected={menu.selected === "edit"}
            onClick={this.onClickEdit}
          >
            Edit
          </MenuItem>
          <MenuItem
            key={"delete"}
            selected={menu.selected === "delete"}
            onClick={this.onClickDelete}
          >
            Delete
          </MenuItem>
        </Menu>
      </Fragment>
    );
  }
}
