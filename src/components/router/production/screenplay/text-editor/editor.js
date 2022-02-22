// @flow
/* eslint import/no-extraneous-dependencies: 0, global-require: 0 */
/* eslint-disable import/no-unresolved */
import React, { type Node, PureComponent } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import firebase from "firebase";
import ksuid from "ksuid";
import { get, map, includes, debounce } from "lodash";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { LineClasses, Modes } from "src/redux/modules/screenplay";
import type {
  ScreenplayUser,
  ScreenplayScene,
  LineClass,
  Metadata
} from "src/redux/modules/screenplay";
import { displayName } from "src/redux/modules/users";
import { isBrowser } from "config/env";
import Toolbar from "src/components/shared/toolbar";
import ScenePicker from "./scene-picker";
import css from "./editor.style.css";
import Comments from "./comments";
import type { ReduxProps } from "./";
import CM from "codemirror";
import "codemirror/addon/mode/overlay";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/search/match-highlighter";
import "codemirror/addon/search/jump-to-line";
import "codemirror/addon/scroll/annotatescrollbar";
import "codemirror/addon/dialog/dialog";
import SpellChecker from "./spellchecker";
import Search from "./search";
import PDFMake from "pdfmake/build/pdfmake";
import PDFMakeVFS from "./pdfmake/vfs_fonts";

window.CodeMirror = CM;

import Firepad from "firepad";

type Props = ReduxProps & {};

type State = {
  ready: boolean,
  spellchecker: {
    showSuggestions: boolean,
    suggestions: Array<string>,
    anchor: ?HTMLElement,
    searchPosition: ?[number, number]
  },
  snackbar: {
    open: boolean,
    message?: Node,
    undo?: Function
  },
  screenplayThreads: Array<{
    id: string,
    line: number,
    ch: number
  }>
};

export default class Editor extends PureComponent<Props, State> {
  mirror: CM;
  fire: firebase.database.Reference;
  pad: Object;
  spellchecker: Object;
  search: Object;

  constructor(props: Props) {
    super(props);
    this.state = {
      ready: false,
      spellchecker: {
        anchor: null,
        showSuggestions: false,
        suggestions: [],
        searchPosition: null
      },
      snackbar: { open: false },
      screenplayThreads: []
    };
  }

  async componentDidMount() {
    await this.getCredentials();

    if (isBrowser()) {
      try {
        await this.setup();
      } catch (e) {
        this.props.loadEditor("rejected", e);
      }
    }
  }

  async getCredentials() {
    const { productionId, screenplayId } = get(this.props, "match.params");
    return this.props.getCredentials(productionId, screenplayId);
  }

  async setup() {
    if (!isBrowser()) return;
    if (this.state.ready || !this.mirror) return;
    window.mirror = this.mirror;

    const { screenplayId } = get(this.props, "match.params");
    const { accessToken, projectId, apiKey } = get(
      this.props,
      "screenplay.credentials",
      {}
    );
    if (!accessToken || !projectId || !apiKey) return;

    this.props.loadEditor("pending");

    firebase.apps.length
      ? firebase.app()
      : firebase.initializeApp({
          projectId,
          apiKey,
          authDomain: `${projectId}.firebaseapp.com`,
          databaseURL: `https://${projectId}.firebaseio.com`
        });

    await firebase.auth().signInWithCustomToken(accessToken);

    firebase.auth().onIdTokenChanged(user => {
      if (user) {
        firebase.database().goOffline();
        firebase.database().goOnline();
      }
    });

    this.fire = firebase.database().ref(screenplayId);
    this.pad = Firepad.fromCodeMirror(this.fire, this.mirror, {
      mode: "screenplay",
      shortcuts: true,
      userId: get(this.props, "currentUser.id"),
      userName: displayName(this.props.currentUser),
      screenplayMode: Modes.EDIT
    });

    // setup spellchecker
    this.spellchecker = new SpellChecker({
      ignored: () => this.props.spellchecker.ignored
    });
    this.spellchecker.defineMode();
    this.mirror.getWrapperElement().oncontextmenu = this.onContextMenu.bind(
      this
    );

    // scene edition
    this.pad.onLockedSceneTitleEdited(
      debounce(
        (scene: ScreenplayScene) => {
          const metadata: Metadata = get(this.props, "screenplay.metadata");
          const { productionId, id } = metadata;

          this.props.lockScenes(productionId, id);
        },
        750,
        { maxWait: 5000 }
      )
    );

    this.pad.onLockedScenesDeleteIntent(
      async (scenes: Array<ScreenplayScene>) => {
        if (!scenes.length) return;

        const metadata: Metadata = get(this.props, "screenplay.metadata");
        const { productionId, id } = metadata;

        const sceneCodes = scenes.map(s => s.sceneCode);

        let message: Node;
        switch (sceneCodes.length) {
          case 1:
            message = <span>Omitted scene {sceneCodes[0]}</span>;
            break;
          case 2:
            message = (
              <span>
                Omitted scenes {sceneCodes[0]} and {sceneCodes[1]}
              </span>
            );
            break;
          case 3:
          case 4:
          case 5:
          case 6:
            message = (
              <span>
                Omitted scenes {sceneCodes.slice(0, -1).join(", ")}, and{" "}
                {sceneCodes.slice(-1)}
              </span>
            );
            break;
          default:
            message = (
              <span>
                Omitted scenes {sceneCodes.slice(0, 5).join(", ")}, and{" "}
                {sceneCodes.length - 5} others
              </span>
            );
        }

        const undo = async () => {
          this.setState({ snackbar: { open: false } });

          scenes.reverse().forEach(async s => {
            await this.pad.restoreScene(s.sceneCode);
          });

          await this.props.lockScenes(productionId, id);
        };

        scenes.forEach(async s => {
          await this.pad.deleteScene(s.sceneCode);
        });

        this.setState({ snackbar: { open: true, message, undo } });
        await this.props.lockScenes(productionId, id);
      }
    );

    this.search = new Search(this.mirror);

    this.pad.onVisibleThreadsChange(threads => {
      const { comments } = this.props;

      if (
        this.state.screenplayThreads.length === comments.length &&
        comments.length !== 0
      )
        return;

      const screenplayThreads = [...this.state.screenplayThreads];

      Object.keys(threads).forEach(thread => {
        if (screenplayThreads.findIndex(t => thread === t) === -1) {
          screenplayThreads.push({ id: thread, ...threads[thread] });
        }
      });

      this.setState({
        screenplayThreads
      });
    });

    this.pad.on("ready", () => {
      this.pad.onScenesChange(this.onScenesChange);
      this.pad.onUsersChange(this.onUsersChange);
      this.pad.onCursorChange(this.onCursorChange);
      this.mirrorSpellChecker();
      this.setState({ ready: true });
      this.props.loadEditor("fulfilled");
    });

    this.mirror.refresh();
    this.mirror.focus();
  }

  onContextMenu = (e: SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!(e.target instanceof HTMLElement)) return false;
    const target = (e.target: HTMLElement);

    // check if there is a spelling error
    if (!target.classList.contains("cm-spell-error")) return false;

    // check if there is a word under the cursor
    const token = target.innerText;
    if (!token) return false;

    this.setState({
      spellchecker: {
        ...this.state.spellchecker,
        anchor: target,
        showSuggestions: true,
        suggestions: this.spellchecker.getSuggestions(token)
      }
    });

    return false;
  };

  onScenesChange = (scenes: Array<ScreenplayScene>) => {
    this.props.scenesUpdated(scenes);
  };

  onCursorChange = (cursor: {
    elementId: ?string,
    lineClass: ?string,
    currentScene: ?ScreenplayScene,
    threadId?: string
  }) => {
    this.props.cursorUpdated(cursor);
  };

  onUsersChange = (users: {
    [userId: string]: {
      color: string,
      cursor: { position: number, selectionEnd: number },
      name: string
    }
  }) => {
    const update: Array<ScreenplayUser> = map(
      users,
      ({ color, cursor }, userId) => ({ userId, color, cursor })
    );

    this.props.usersUpdated(update);
  };

  onSceneSelected = async (scene: ScreenplayScene) => {
    await this.props.selectScene(scene.sceneId, scene.sceneCode);
    this.pad.scrollToScene(scene.sceneCode);
  };

  changeLineClass = async (lc: string) => {
    const lineClass: LineClass = includes(LineClasses, lc)
      ? lc
      : LineClasses.None;

    this.pad.setLineClass(lineClass);

    setTimeout(() => {
      this.mirror.focus();
    }, 100);

    return this.props.cursorUpdated({ lineClass });
  };

  toggleBold = async () => {
    this.pad.bold();
  };

  toggleItalic = async () => {
    this.pad.italic();
  };

  toggleUnderline = async () => {
    this.pad.underline();
  };

  createScene = async () => {
    this.pad.prepareForNewScene();
  };

  // TODO: only lock the scenes in the unlocked scenes visible in the filtered scenePicker view
  lockScenes = async () => {
    const metadata: Metadata = get(this.props, "screenplay.metadata");
    const { productionId, id } = metadata;

    return new Promise(resolve => {
      this.pad.lockScenes(
        () => ksuid.randomSync().string,
        async scenes => {
          await this.props.lockScenes(productionId, id);
          this.onScenesChange(scenes);
          resolve();
        }
      );
    });
  };

  publishChanges = async () => {
    // TODO: waiting on endpoint to publish scenes
    //       needs to lock scenes first if they weren't
  };

  componentWillUnmount() {
    if (this.pad) {
      this.pad.dispose();
    }
  }

  toggleSpellChecker = async () => {
    await this.props.toggleSpellChecker();
    this.mirrorSpellChecker();
  };

  mirrorSpellChecker = () => {
    const { active } = this.props.spellchecker;
    this.mirror.setOption("mode", active ? "spell-checker" : "screenplay");
    if (active) this.mirror.setOption("backdrop", "screenplay");
  };

  selectSpellcheckerSuggestion = (suggestion: string) => {
    const { mirror } = this;

    // replace word under cursor with suggestion.
    const { anchor, head } = mirror.findWordAt(mirror.getCursor());
    mirror.replaceRange(suggestion, anchor, head);

    // dismiss suggestion menu.
    this.dismissSpellcheckerSuggestions();
  };

  addToDictionary = async () => {
    const { mirror } = this;

    // find word under cursor.
    const { anchor, head } = mirror.findWordAt(mirror.getCursor());
    const word = mirror.getRange(anchor, head);

    await this.props.addToDictionary(word);

    // ugly hack to rerun overlays
    mirror.options.maxHighlightLength = mirror.options.maxHighlightLength || 0;
    // eslint-disable-next-line no-plusplus
    const maxHighlightLength = --mirror.options.maxHighlightLength;

    mirror.setOption("maxHighlightLength", maxHighlightLength + 1);

    this.dismissSpellcheckerSuggestions();
  };

  dismissSpellcheckerSuggestions = () => {
    this.setState({
      spellchecker: {
        ...this.state.spellchecker,
        showSuggestions: false,
        suggestions: [],
        anchor: null
      }
    });
  };

  omitScene = async (scene: ScreenplayScene) => {
    if (!this.pad) return;

    const metadata: Metadata = get(this.props, "screenplay.metadata");
    const { productionId, id } = metadata;

    await this.pad.deleteScene(scene.sceneCode);
    await this.props.lockScenes(productionId, id);
  };

  deleteScene = async (scene: ScreenplayScene) => {
    if (!this.pad) return;
    this.pad.deleteScene(scene.sceneCode);
  };

  lockScene = async (scene: ScreenplayScene) => {
    const metadata: Metadata = get(this.props, "screenplay.metadata");
    const { productionId, id } = metadata;

    return new Promise(resolve => {
      this.pad.lockScenes(
        () => ksuid.randomSync().string,
        scene.sceneCode,
        async scenes => {
          await this.props.lockScenes(productionId, id);
          this.onScenesChange(scenes);
          resolve();
        }
      );
    });
  };

  lockScenes = async (sceneCodes?: Array<string>) => {
    const metadata: Metadata = get(this.props, "screenplay.metadata");
    const { productionId, id } = metadata;

    return new Promise(resolve => {
      this.pad.lockScenes(
        () => ksuid.randomSync().string,
        sceneCodes,
        async scenes => {
          await this.props.lockScenes(productionId, id);
          this.onScenesChange(scenes);
          resolve();
        }
      );
    });
  };

  restoreScene = async (scene: ScreenplayScene) => {
    if (!this.pad) return;

    const metadata: Metadata = get(this.props, "screenplay.metadata");
    const { productionId, id } = metadata;

    await this.pad.restoreScene(scene.sceneCode);
    this.props.lockScenes(productionId, id);
  };

  printScreenplay = async () => {
    if (!this.pad) return;

    const docDef = this.pad.getJsonForPdfMake("CourierPrime");

    if (docDef) {
      // Ref: https://github.com/bpampuch/pdfmake/wiki/Custom-Fonts---client-side
      PDFMake.vfs = PDFMakeVFS;

      PDFMake.fonts = {
        CourierPrime: {
          normal: "Courier Prime.ttf",
          bold: "Courier Prime Bold.ttf",
          italics: "Courier Prime Italic.ttf",
          bolditalics: "Courier Prime Bold Italic.ttf"
        }
      };

      PDFMake.createPdf(docDef).print();
    }
  };

  handleCloseSnackbar = (_?: Event, reason?: string) => {
    if (reason === "clickaway") return;
    this.setState({ snackbar: { open: false } });
  };

  doSearch = async (
    query: string,
    reverse: boolean = false,
    focusOnMatches: boolean = false
  ) => {
    const { search } = this;
    if (!search) return;
    search.setQuery(query);
    search.find(reverse, !focusOnMatches);

    this.setState({
      spellchecker: {
        ...this.state.spellchecker,
        searchPosition: search.state.searchPosition
      }
    });
  };

  doReplace = async (
    query: string,
    replacement: string,
    all: boolean = false
  ) => {
    const { search } = this;
    if (!search) return;

    search.setQuery(query);
    search.setReplacement(replacement);
    search.replace(all);

    this.setState({
      spellchecker: {
        ...this.state.spellchecker,
        searchPosition: search.state.searchPosition
      }
    });
  };

  clearSearch = async () => {
    const { search } = this;
    if (!search) return;
    search.clear();
  };

  undo = () => {
    this.pad.undo();
  };

  render() {
    const { spellchecker, snackbar, screenplayThreads } = this.state;
    // eslint-disable-next-line standard/object-curly-even-spacing
    const { screenplay /*, isAddingNewComment */ } = this.props;

    const screenplayId = get(screenplay, "metadata.id", "");
    // const showingComments = !!(screenplayThreads.length || isAddingNewComment);
    const showingComments = false;

    return (
      <div
        className={css.editor}
        style={{
          minWidth: showingComments ? 1095 : 825
        }}
      >
        <Toolbar
          type="editor"
          changeLineClass={this.changeLineClass}
          toggleBold={this.toggleBold}
          toggleItalic={this.toggleItalic}
          toggleUnderline={this.toggleUnderline}
          publishChanges={this.publishChanges}
          createNew={this.createScene}
          createNewAltText="New Scene"
          deleteScene={this.deleteScene}
          omitScene={this.omitScene}
          printScreenplay={this.printScreenplay}
          toggleSpellChecker={this.toggleSpellChecker}
          search={this.doSearch}
          replace={this.doReplace}
          clearSearch={this.clearSearch}
          searchPosition={spellchecker.searchPosition}
          undo={this.undo}
          lockScenes={this.lockScenes}
        />
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => this.handleCloseSnackbar()}
          message={snackbar.message}
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={snackbar.undo}
            >
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={css.close}
              onClick={this.handleCloseSnackbar}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
        <div className={css.wrapper}>
          <ScenePicker
            selectScene={this.onSceneSelected}
            omitScene={this.omitScene}
            deleteScene={this.deleteScene}
            lockScene={this.lockScene}
            lockScenes={this.lockScenes}
            restoreScene={this.restoreScene}
          />

          {/* <div
            className={css.screenplayContainer}
            style={{
              marginLeft: showingComments ? 24 : 0
            }}
          > */}
          <div className={css.content}>
            {isBrowser() ? (
              <CodeMirror
                editorDidMount={e => {
                  this.mirror = e;
                }}
                options={{
                  autofocus: true,
                  lineWrapping: true,
                  singleCursorHeightPerLine: false
                }}
              />
            ) : null}
          </div>
          <div
            className={css.rightSideBar}
            style={{
              width: showingComments ? undefined : 0
            }}
          >
            {this.state.ready &&
              showingComments && (
                <Comments
                  screenplayId={screenplayId}
                  mirror={this.mirror}
                  pad={this.pad}
                  screenplayThreads={screenplayThreads}
                  showComments={showingComments}
                />
              )}
          </div>
          {/* </div> */}
          <Menu
            id="spellchecker-suggestions"
            anchorEl={spellchecker.anchor}
            open={spellchecker.showSuggestions}
            onClose={this.dismissSpellcheckerSuggestions}
          >
            {spellchecker.suggestions.map(s => (
              <MenuItem
                key={s}
                onClick={(_: SyntheticEvent<>) =>
                  this.selectSpellcheckerSuggestion(s)
                }
              >
                {s}
              </MenuItem>
            ))}
            <MenuItem
              key={"add-to-dictionary"}
              onClick={(_: SyntheticEvent<>) => this.addToDictionary()}
            >
              Add to dictionary
            </MenuItem>
          </Menu>
        </div>
      </div>
    );
  }
}
