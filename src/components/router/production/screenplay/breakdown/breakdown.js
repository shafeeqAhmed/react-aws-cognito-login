// @flow
import React, { PureComponent } from "react";
import firebase from "firebase";
import { get, map } from "lodash";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { Modes } from "src/redux/modules/screenplay";
import type {
  ScreenplayUser,
  ScreenplayScene,
  ShootingEvent
} from "src/redux/modules/screenplay";
import { displayName } from "src/redux/modules/users";
import ContentLoader from "react-content-loader";
import Toolbar from "./toolbar";
import ScenePicker from "./scene-picker";
import css from "./breakdown.style.css";
import type { ReduxProps } from "./";
import { isBrowser } from "config/env";
import CM from "codemirror";
import "codemirror/addon/mode/overlay";
import Firepad from "firepad/dist/firepad";
import Categories from "./categories";
import classNames from "classnames";
import StripBar from "./stripbar";

type Props = ReduxProps & {};

type State = {
  ready: boolean
};

export default class Breakdown extends PureComponent<Props, State> {
  mirror: CM;
  fire: firebase.database.Reference;
  pad: Firepad;

  state: State = {
    ready: false
  };

  async getCredentials() {
    const { productionId, screenplayId } = get(this.props, "match.params");
    return this.props.getCredentials(productionId, screenplayId);
  }

  async setup() {
    if (!this.mirror || !this.props.selectedShootingEvent) {
      return;
    }

    if (!isBrowser()) return;
    if (this.state.ready || !this.mirror) return;
    window.mirror = this.mirror;

    const { accessToken, projectId, apiKey } = get(
      this.props,
      "screenplay.credentials",
      {}
    );
    if (!accessToken || !projectId || !apiKey) return;

    this.props.loadEditor("pending");

    try {
      if (!this.fire) {
        await this.setupFirebase();
      }

      await this.setupFirepad();

      this.setState({ ready: true });
      this.props.loadEditor("fulfilled");
      this.mirror.refresh();
    } catch (e) {
      this.props.loadEditor("rejected");
      this.setState({ ready: false });
    }
  }

  async componentDidMount() {
    const {
      switchMode,
      fetchShootingEvents,
      getCredentials,
      match,
      selectedShootingEvent,
      shootingEvents,
      selectShootingEvent
    } = this.props;

    const { productionId, screenplayId } = match.params;

    await getCredentials(productionId, screenplayId);

    await Promise.all([
      switchMode(Modes.TAG),
      fetchShootingEvents(productionId, screenplayId),
      getCredentials(productionId, screenplayId)
    ]);

    if (!selectedShootingEvent && shootingEvents.length) {
      await selectShootingEvent(shootingEvents[0].id);
    }

    await Promise.all([this.setup(), this.fetchCategories()]);
  }

  removeElementAnchors = async (elementId: string) => {
    const { selectedShootingEvent, match, syncAnchorsRemoved } = this.props;
    const { productionId, screenplayId } = match.params;
    const shootingEventId = get(selectedShootingEvent, "id");

    if (!this.pad) return null;
    this.pad.deleteElement(elementId);

    return syncAnchorsRemoved({
      productionId,
      screenplayId,
      shootingEventId,
      elementId
    });
  };

  toggleElementAnchor = async (elementId: string, categoryColor: string) => {
    const {
      match,
      selectedShootingEvent,
      screenplay,
      syncAnchorAdded,
      syncAnchorRemoved
    } = this.props;
    const { productionId, screenplayId } = match.params;
    const shootingEventId = get(selectedShootingEvent, "id");

    const isTextSelected = !!get(screenplay, "cursor.selections[0]");
    if (!isTextSelected) return;

    if (!this.pad) return;
    this.pad.toggleElement(elementId, categoryColor);

    if (!get(screenplay, "cursor.elementId")) {
      // unanchored text is selected
      syncAnchorAdded({
        productionId,
        screenplayId,
        shootingEventId,
        elementId
      });
    } else if (get(screenplay, "cursor.elementId") === elementId) {
      // anchored text is selected for the same element
      syncAnchorRemoved({
        productionId,
        screenplayId,
        shootingEventId,
        elementId
      });
    } else {
      // anchor is selected for other element
      syncAnchorRemoved({
        productionId,
        screenplayId,
        shootingEventId,
        elementId: get(screenplay, "cursor.elementId")
      });

      syncAnchorAdded({
        productionId,
        screenplayId,
        shootingEventId,
        elementId
      });
    }
  };

  fetchCategories = () => {
    const { fetchCategories, fetchElements } = this.props;
    const { productionId, screenplayId } = get(this.props, "match.params");

    return Promise.all([
      fetchCategories({ productionId }),
      fetchElements({ productionId, screenplayId })
    ]);
  };

  setupFirebase = async () => {
    const { screenplayId } = get(this.props, "match.params");

    const { accessToken, projectId, apiKey } = get(
      this.props,
      "screenplay.credentials",
      {}
    );

    if (!accessToken || !projectId || !apiKey) return;

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
  };

  setupFirepad = async () => {
    if (this.pad) {
      this.pad.dispose();
      await this.resetCodeMirror();
    }

    return new Promise((resolve, reject) => {
      this.pad = Firepad.fromCodeMirror(this.fire, this.mirror, {
        mode: "screenplay",
        shortcuts: true,
        userId: get(this.props, "currentUser.id"),
        userName: displayName(this.props.currentUser),
        screenplayMode: this.props.screenplayMode,
        shootingEvent: this.props.selectedShootingEvent
      });

      this.pad.on("ready", () => {
        this.pad.onUsersChange(this.onUsersChange);
        this.pad.onCursorChange(this.onCursorChange);
        resolve();
      });
    });
  };

  resetCodeMirror = async () => {
    if (!this.mirror || !this.pad) return;
    this.mirror.setValue("");
    // $FlowFixMe
    this.mirror.clearHistory();
  };

  onCursorChange = (cursor: {
    elementId: ?string,
    lineClass: ?string,
    currentScene: ?ScreenplayScene,
    threadId: ?string
  }) => {
    this.props.cursorUpdated({
      ...cursor,
      selections: this.mirror.getSelections()
    });
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

  selectShootingEvent = (shootingEvent: ShootingEvent) => {
    this.props.selectShootingEvent(shootingEvent.id);
    this.pad.setShootingEvent(shootingEvent);
    // this.setupFirepad();
  };

  publishChanges = async () => {
    // not implemented yet
  };

  componentWillUnmount() {
    if (this.pad) {
      this.pad.dispose();
    }
  }

  renderPlaceholder = (): any => {
    const { shootingEvents } = this.props;
    return shootingEvents.map(s => {
      const grey = s.scenes.some(scene => scene.sceneType === "SECONDARY");

      return (
        <div
          className={classNames({
            [css.placeholderScene]: true,
            [css.placeholderSceneGrey]: grey
          })}
          key={s.id}
        >
          <div className={css.placeholderHeader}>
            <div className={css.placeholderLeftCode}>{s.code}</div>
            <div className={css.placeholderName}>{s.name}</div>
            <div className={css.placeholderRightCode}>{s.code}</div>
          </div>
          <div className={css.contentContainer}>
            <ContentLoader
              rtl
              height={130}
              width={543}
              speed={2}
              primaryColor={grey ? "#fbfbfc" : "#f3f3f3"}
              secondaryColor="#ecebeb"
              className={css.placeholderContent}
            >
              <rect x="0" y="0" rx="0" ry="0" width="518" height="12" />
              <rect x="0" y="18" rx="0" ry="0" width="543" height="12" />
              <rect x="0" y="36" rx="0" ry="0" width="233" height="12" />
              <rect x="194" y="73" rx="0" ry="0" width="91" height="12" />
              <rect x="92" y="91" rx="0" ry="0" width="250" height="12" />
              <rect x="92" y="109" rx="0" ry="0" width="134" height="12" />
            </ContentLoader>
          </div>
        </div>
      );
    });
  };

  render() {
    const { selectShootingEvent } = this;
    const { areScenesCollapsed } = this.props;

    // $FlowFixMe
    return (
      <div className={css.editor}>
        <Toolbar publishChanges={this.publishChanges} />
        <div className={css.wrapper}>
          {!areScenesCollapsed && (
            <ScenePicker selectShootingEvent={selectShootingEvent} />
          )}
          <div
            className={classNames({
              [css.content]: true,
              [css.hidden]: !this.state.ready
            })}
          >
            <StripBar />
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
            {!this.state.ready && (
              <div className={css.placeholderContainer}>
                {this.renderPlaceholder()}
              </div>
            )}
          </div>
          <div className={css.rightSidebar}>
            <Categories
              toggleElementAnchor={this.toggleElementAnchor}
              removeElementAnchors={this.removeElementAnchors}
            />
          </div>
        </div>
      </div>
    );
  }
}
