/* eslint-disable import/no-named-default */
/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React, { Fragment, PureComponent } from "react";
import Moment from "moment";
import { get, orderBy } from "lodash";
import cx from "classnames";
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
import SoundDrawer from "../SoundDrawer";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import type { Props } from "./";
import type { Sound } from "src/redux/modules/sounds";
import css from "./table.styles.css";
import Uploader from "../uploader";

type State = {
  editingSound: ?Sound,
  order: {
    by: string,
    direction: "asc" | "desc"
  },
  menu: {
    open: boolean,
    selected: ?string,
    anchor: ?any,
    sound: ?Sound
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
    editingSound: null,
    menu: {
      open: false,
      selected: null,
      anchor: null,
      sound: null
    },
    order: {
      by: "team_order",
      direction: "asc"
    },
    sounds: {}
  };

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

  componentDidMount() {
    const { fetchTags, fetchSounds, match } = this.props;
    const { teamId } = match.params;

    fetchTags({ teamId });
    fetchSounds({ teamId });
  }

  componentDidUpdate(prev: Props) {
    const { sounds } = this.props;
    sounds.forEach(sound => this.requestPlayUrl(sound));
  }

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

  onClickMenu = (sound: Sound, e: Event) => {
    const target = e.currentTarget || e.target;

    e.preventDefault();
    e.stopPropagation();

    this.setState(state => ({
      menu: {
        open: state.menu.sound === sound ? !state.menu.open : true,
        selected: null,
        anchor: target,
        sound
      }
    }));
  };

  onClickEditSound = (e: Event, sound?: Sound) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.setState(state => ({
      editingSound: sound || state.menu.sound,
      menu: {
        ...state.menu,
        open: false,
        selected: null
      }
    }));
  };

  onClickDownloadSound = (e: Event) => {
    const { downloadSounds, team } = this.props;
    const { menu } = this.state;

    downloadSounds({
      teamId: team.id,
      soundIds: [get(menu, "sound.id")]
    });
  };

  onClickDeleteSound = (e: Event) => {
    const { team, deleteSound } = this.props;
    const { menu } = this.state;

    deleteSound({ teamId: team.id, soundId: get(menu, "sound.id") });
  };

  render() {
    const { editingSound, menu, order, sounds } = this.state;
    const {
      sounds: unsorted,
      selectedRowIds,
      select,
      unselect,
      resetSelection
    } = this.props;

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
                      onChange={e => {
                        if (selectedRowIds.length === data.length) {
                          resetSelection();
                          return;
                        }

                        select(data.map(d => d.id));
                      }}
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
                      disabled={typeof rowData.team_order === "undefined"}
                    />
                  ),
                  cellProps: {
                    style: { paddingRight: 0, paddingLeft: 0 },
                    className: css.cell
                  },
                  width: 60
                },
                {
                  name: "team_order",
                  header: "ID",
                  cellProps: {
                    style: { paddingRight: 0, paddingLeft: 0 },
                    className: css.cell
                  },
                  cell: sound => (
                    <span>
                      {typeof sound.team_order === "undefined"
                        ? ""
                        : String(sound.team_order).padStart(5, "0")}
                    </span>
                  ),
                  width: 50
                },
                {
                  name: "duration",
                  header: "Time",
                  cellProps: {
                    style: { paddingRight: 0, paddingLeft: 0 },
                    className: css.cell
                  },
                  width: 135,
                  cell: sound => (
                    <div className={css.timeCell}>
                      {sound.play_url ? (
                        <NoSsr>
                          <ReactSound
                            url={sound.play_url}
                            onLoading={args => this.onLoadingSound(sound, args)}
                            onLoad={args => this.onLoadSound(sound, args)}
                            onPlaying={args => this.onPlayingSound(sound, args)}
                            onPause={args => this.onPauseSound(sound, args)}
                            onStopped={args => this.onStoppedSound(sound, args)}
                            onResume={args => this.onResumeSound(sound, args)}
                            playStatus={get(
                              this.state,
                              `sounds[${sound.id}].playStatus`,
                              ReactSound.status.STOPPED
                            )}
                          />
                        </NoSsr>
                      ) : null}

                      <SoundWave className={css.soundWave} progress={100} />

                      <span className={css.soundDuration}>
                        {get(sounds[sound.id], "position") ||
                        get(sounds[sound.id], "duration")
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
                        tabIndex={0}
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
                  )
                },
                {
                  name: "name",
                  cellProps: {
                    style: { paddingLeft: 0 },
                    className: cx(css.horizontalScroll, css.cell)
                  },
                  header: "Title"
                },
                {
                  name: "productions",
                  header: "Productions",
                  width: 100,
                  cellProps: {
                    className: css.cell
                  },
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

                    return (
                      <span className={css.horizontalScroll}>
                        {productionName}
                      </span>
                    );
                  }
                },
                {
                  name: "description",
                  cellProps: {
                    style: { paddingRight: 0 },
                    className: cx(css.horizontalScroll, css.cell)
                  },
                  header: "Description / Notes"
                },
                {
                  name: "tags",
                  header: "Tags",
                  cellProps: {
                    style: { paddingRight: 0 },
                    className: css.cell
                  },
                  cell: rowData => (
                    <div className={cx(css.tags, css.horizontalScroll)}>
                      {get(rowData, "tags", []).map(t => (
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
                  cellProps: {
                    style: { paddingRight: 0, paddingLeft: 0 },
                    className: css.cell
                  },
                  width: 50,
                  cell: sound => (
                    <div className={css.menuCell}>
                      <IconButton
                        className={css.rowMenuButton}
                        onClick={e => this.onClickMenu(sound, e)}
                        disabled={typeof sound.team_order === "undefined"}
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
              orderBy={order.by}
              orderDirection={order.direction}
              onHeaderClick={({ name }) => {
                if (name === "checkbox") return;

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
                }));
              }}
              onCellDoubleClick={(event, { column, rowData }) =>
                this.onClickEditSound(event, rowData)
              }
              onCellContextMenu={(event, { column, rowData }) =>
                this.onClickMenu(rowData, event)
              }
              onCellClick={(event, { column, rowData }) => {
                if (selectedRowIds.some(id => rowData.id === id)) {
                  unselect([rowData.id]);
                  return;
                }

                select(rowData.id);
              }}
            />
          )}
        </AutoSizer>

        <SoundDrawer
          open={!!editingSound}
          sound={editingSound}
          onClose={() =>
            this.setState({
              editingSound: null
            })
          }
        />

        <Menu
          id="sound-menu"
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
            onClick={this.onClickEditSound}
          >
            Edit
          </MenuItem>
          <MenuItem
            key={"delete"}
            selected={menu.selected === "delete"}
            onClick={this.onClickDeleteSound}
          >
            Delete
          </MenuItem>
          <MenuItem
            key={"download"}
            selected={menu.selected === "download"}
            onClick={this.onClickDownloadSound}
          >
            Download
          </MenuItem>
        </Menu>

        <Uploader />
      </Fragment>
    );
  }
}
