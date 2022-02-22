// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { createRef, Fragment, PureComponent } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { get } from "lodash";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import type { Props } from "./";
import FileIcon from "src/components/shared/FileIcon";
import EditIcon from "@material-ui/icons/Edit";
import {
  SubjectTypes,
  Actions,
  type Action,
  type Subject,
  type Policy,
  ResourceTypes
} from "src/redux/modules/gatekeeper";
import css from "./shareFile.style.css";
import { displayName } from "src/redux/modules/users/helpers";
import UserAvatar from "src/components/shared/UserAvatar";

type State = {
  editingNewPolicyAction: boolean,
  newPolicyAction: Action,
  newPolicySubjects: Array<Subject>,
  editingPolicy: ?{
    id: string,
    el: HTMLElement
  },
  isSearching: boolean
};

export default class ShareFile extends PureComponent<Props, State> {
  newPolicyActionRef: { current: ?HTMLElement };

  constructor(props: Props) {
    super(props);

    this.newPolicyActionRef = createRef();

    this.state = {
      editingNewPolicyAction: false,
      newPolicyAction: Actions.VIEW,
      newPolicySubjects: [],
      editingPolicy: null,
      isSearching: false
    };
  }

  close = () => {
    this.props.onClose();
  };

  closeSearch = () => {
    // switch off search mode
    this.setState({ isSearching: false });

    // reset search query
    const { search, production } = this.props;
    search(get(production, "id", ""), "");
  };

  // TODO: detect if pressing escape or backspace on an empty search query
  handleSearchChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const query = get(e, "target.value");
    const { production, search } = this.props;
    search(get(production, "id", ""), query);
    this.setState({ isSearching: true });
  };

  toggleEditPolicy = (e: SyntheticMouseEvent<HTMLElement>, p: Policy) => {
    e.persist();

    this.setState((state: State) => ({
      editingPolicy:
        state.editingPolicy && state.editingPolicy.id === p.id
          ? null
          : {
              id: p.id,
              el: ((e.target: any): HTMLElement)
            }
    }));
  };

  editPolicy = (e: SyntheticMouseEvent<HTMLElement>, p: Policy, a: Action) => {
    const { production, deletePolicy, createPolicy } = this.props;
    const productionId = get(production, "id", "");

    switch (a) {
      case Actions.NONE:
        deletePolicy(productionId, p.id);
        break;

      case Actions.VIEW:
      case Actions.EDIT:
      case Actions.ADMIN:
        deletePolicy(productionId, p.id);
        createPolicy(productionId, p.resource, p.subject, a);
        break;

      default:
        break;
    }

    this.closeEditPolicyMenu();
  };

  closeEditPolicyMenu = () => {
    this.setState({ editingPolicy: null });
  };

  openEditNewPolicyMenu = () => {
    this.setState({ editingNewPolicyAction: true });
  };

  closeEditNewPolicyMenu = () => {
    this.setState({ editingNewPolicyAction: false });
  };

  editNewPolicyAction = (e: Event, a: Action) => {
    this.setState({ newPolicyAction: a });
    this.closeEditNewPolicyMenu();
  };

  addPolicyFor = (s: Subject) => {
    const { createPolicy, file, production } = this.props;
    const { newPolicyAction } = this.state;
    const productionId = get(production, "id", "");

    createPolicy(
      productionId,
      { type: ResourceTypes.FILE, id: file.id },
      s,
      newPolicyAction
    );
  };

  render() {
    const { file, production, searchQuery } = this.props;
    const { isSearching } = this.state;

    return (
      <Paper className={css.modalContainer} square>
        <div className={css.header}>
          <FileIcon file={file} className={css.fileIcon} />
          <span className={css.fileName}>
            {get(file, "name", get(production, "name", ""))}
          </span>
          <span className={css.collaborators}>Collaborators</span>
          <IconButton
            classes={{
              root: css.closeIconButton
            }}
            onClick={this.props.onClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className={css.content}>
          <div className={css.search}>
            <TextField
              value={searchQuery}
              onChange={this.handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    className={css.searchInputAdornment}
                  >
                    <SearchIcon className={css.searchIcon} />
                  </InputAdornment>
                ),
                disableUnderline: true,
                classes: {
                  root: css.searchInputRoot,
                  input: css.searchInput
                }
              }}
              autoFocus
              fullWidth
              placeholder="Add person, department or tag..."
              type="search"
              classes={{
                root: css.searchTextField
              }}
            />
            {isSearching && (
              <Button
                onClick={this.closeSearch}
                classes={{
                  root: css.closeSearchButton
                }}
                labelStyle={{ height: "32px" }}
              >
                done
              </Button>
            )}
          </div>
          {isSearching ? this.renderSearch() : this.renderSections()}
        </div>
        <div className={css.footer} />
      </Paper>
    );
  }

  renderSections() {
    const { production, policies, tags, departments, users } = this.props;
    const { editingPolicy } = this.state;

    const depPolicies = policies.filter(
      p => p.subject.type === SubjectTypes.DEPARTMENT
    );
    const tagPolicies = policies.filter(
      p => p.subject.type === SubjectTypes.TAG
    );
    const userPolicies = policies.filter(
      p => p.subject.type === SubjectTypes.USER
    );

    return (
      <Fragment>
        <div className={css.section}>
          <div className={css.item}>
            <div className={css.title}>
              <span className={css.titleText}>
                {get(production, "name", "")}
              </span>
            </div>
            <Button className={css.permissionLevel} disabled>
              <span className={css.permissionLevelTitle}>
                {permissionLevel(Actions.ADMIN)}
              </span>
            </Button>
          </div>
        </div>
        <div className={css.section}>
          {depPolicies.length ? (
            <div className={css.subSection}>
              <div className={css.subSectionTitle}>
                <span className={css.subSectionTitleText}>departments</span>
              </div>
              <TransitionGroup className={css.items}>
                {depPolicies.map(p => (
                  <CSSTransition
                    key={p.id}
                    timeout={250}
                    classNames={{
                      exit: css.itemExitActive,
                      exitActive: css.itemExitActive
                    }}
                  >
                    <div key={p.id} className={css.item}>
                      <div className={css.title}>
                        <span className={css.titleText}>
                          {get(departments, `${p.subject.id}.name`, "")}
                        </span>
                      </div>
                      <Button
                        className={css.permissionLevel}
                        disabled={p.action === Actions.ADMIN}
                        onClick={e => this.toggleEditPolicy(e, p)}
                      >
                        <span className={css.permissionLevelTitle}>
                          {permissionLevel(p.action)}
                        </span>
                        {p.action === Actions.ADMIN ? null : (
                          <EditIcon className={css.permissionLevelEditIcon} />
                        )}
                      </Button>
                      <Menu
                        id={`edit-policy-${p.id}`}
                        anchorEl={get(editingPolicy, "el")}
                        open={get(editingPolicy, "id", false) === p.id}
                        onClose={() => this.closeEditPolicyMenu()}
                      >
                        {[
                          Actions.VIEW,
                          Actions.EDIT,
                          Actions.ADMIN,
                          Actions.NONE
                        ].map(action => (
                          <MenuItem
                            key={action}
                            selected={action === p.action}
                            onClick={e => this.editPolicy(e, p, action)}
                          >
                            {permissionLevel(action, true)}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          ) : null}
          {tagPolicies.length ? (
            <div className={css.subSection}>
              <div className={css.subSectionTitle}>
                <span className={css.subSectionTitleText}>tags</span>
              </div>
              <TransitionGroup className={css.items}>
                {tagPolicies.map(p => (
                  <CSSTransition
                    key={p.id}
                    timeout={250}
                    classNames={{
                      exit: css.itemExitActive,
                      exitActive: css.itemExitActive
                    }}
                  >
                    <div key={p.id} className={css.item}>
                      <div className={css.title}>
                        <span className={css.tagTitleText}>
                          {get(tags, `${p.subject.id}.name`, "")}
                        </span>
                      </div>
                      <Button
                        className={css.permissionLevel}
                        disabled={p.action === Actions.ADMIN}
                        onClick={e => this.toggleEditPolicy(e, p)}
                      >
                        <span className={css.permissionLevelTitle}>
                          {permissionLevel(p.action)}
                        </span>
                        {p.action === Actions.ADMIN ? null : (
                          <EditIcon className={css.permissionLevelEditIcon} />
                        )}
                      </Button>
                      <Menu
                        id={`edit-policy-${p.id}`}
                        anchorEl={get(editingPolicy, "el")}
                        open={get(editingPolicy, "id", false) === p.id}
                        onClose={() => this.closeEditPolicyMenu()}
                      >
                        {[
                          Actions.VIEW,
                          Actions.EDIT,
                          Actions.ADMIN,
                          Actions.NONE
                        ].map(action => (
                          <MenuItem
                            key={action}
                            selected={action === p.action}
                            onClick={e => this.editPolicy(e, p, action)}
                          >
                            {permissionLevel(action, true)}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          ) : null}
          {userPolicies.length ? (
            <div className={css.subSection}>
              <div className={css.subSectionTitle}>
                <span className={css.subSectionTitleText}>people</span>
              </div>
              <TransitionGroup className={css.items}>
                {userPolicies.map(p => (
                  <CSSTransition
                    key={p.id}
                    timeout={250}
                    classNames={{
                      exit: css.itemExitActive,
                      exitActive: css.itemExitActive
                    }}
                  >
                    <div key={p.id} className={css.item}>
                      <div className={css.title}>
                        <div className={css.userAvatar}>
                          <UserAvatar user={users[p.subject.id]} />
                        </div>
                        <span className={css.titleText}>
                          {displayName(users[p.subject.id])}
                        </span>
                        {users[p.subject.id].roles &&
                          users[p.subject.id].roles.length && (
                            <span className={css.userRoleTitleText}>
                              {users[p.subject.id].roles
                                .map(r => r.name)
                                .join(", ")}
                            </span>
                          )}
                      </div>
                      <Button
                        className={css.permissionLevel}
                        disabled={p.action === Actions.ADMIN}
                        onClick={e => this.toggleEditPolicy(e, p)}
                      >
                        <span className={css.permissionLevelTitle}>
                          {permissionLevel(p.action)}
                        </span>
                        {p.action === Actions.ADMIN ? null : (
                          <EditIcon className={css.permissionLevelEditIcon} />
                        )}
                      </Button>
                      <Menu
                        id={`edit-policy-${p.id}`}
                        anchorEl={get(editingPolicy, "el")}
                        open={get(editingPolicy, "id", false) === p.id}
                        onClose={() => this.closeEditPolicyMenu()}
                      >
                        {[
                          Actions.VIEW,
                          Actions.EDIT,
                          Actions.ADMIN,
                          Actions.NONE
                        ].map(action => (
                          <MenuItem
                            key={action}
                            selected={action === p.action}
                            onClick={e => this.editPolicy(e, p, action)}
                          >
                            {permissionLevel(action, true)}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          ) : null}
        </div>
      </Fragment>
    );
  }

  renderSearch() {
    const { searchResults } = this.props;
    const { departments, tags, users } = searchResults;
    const { editingNewPolicyAction, newPolicyAction } = this.state;

    return (
      <Fragment>
        <div className={css.section}>
          <div className={css.item}>
            <div className={css.title}>
              <span className={css.titleText}>
                {permissionLevel(newPolicyAction, true)}
              </span>
            </div>
            <IconButton
              className={css.searchPermissionLevel}
              onClick={this.openEditNewPolicyMenu}
              buttonRef={((this.newPolicyActionRef: any): Function)}
            >
              <EditIcon className={css.searchPermissionLevelEditIcon} />
            </IconButton>
            <Menu
              id={`new-policy-action`}
              anchorEl={this.newPolicyActionRef.current}
              open={editingNewPolicyAction}
              onClose={this.closeEditNewPolicyMenu}
            >
              {[Actions.VIEW, Actions.EDIT, Actions.ADMIN].map(action => (
                <MenuItem
                  key={action}
                  selected={action === newPolicyAction}
                  onClick={e => this.editNewPolicyAction(e, action)}
                >
                  {permissionLevel(action, true)}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
        <div className={css.section}>
          {departments.length ? (
            <div className={css.subSection}>
              <div className={css.subSectionTitle}>
                <span className={css.subSectionTitleText}>departments</span>
              </div>
              <TransitionGroup className={css.items}>
                {departments.map(d => (
                  <CSSTransition
                    key={d.id}
                    timeout={250}
                    classNames={{
                      exit: css.itemExitActive,
                      exitActive: css.itemExitActive
                    }}
                  >
                    <div
                      className={css.searchItem}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        this.addPolicyFor({
                          type: SubjectTypes.DEPARTMENT,
                          id: `${d.id}`
                        })
                      }
                    >
                      <span className={css.titleText}>{d.name}</span>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          ) : null}
          {tags.length ? (
            <div className={css.subSection}>
              <div className={css.subSectionTitle}>
                <span className={css.subSectionTitleText}>tags</span>
              </div>
              <TransitionGroup className={css.items}>
                {tags.map(t => (
                  <CSSTransition
                    key={t.id}
                    timeout={250}
                    classNames={{
                      exit: css.itemExitActive,
                      exitActive: css.itemExitActive
                    }}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      className={css.item}
                      onClick={() =>
                        this.addPolicyFor({
                          type: SubjectTypes.TAG,
                          id: `${t.id}`
                        })
                      }
                    >
                      <div className={css.title}>
                        <span className={css.tagTitleText}>{t.name}</span>
                      </div>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          ) : null}
          {users.length ? (
            <div className={css.subSection}>
              <div className={css.subSectionTitle}>
                <span className={css.subSectionTitleText}>people</span>
              </div>
              <TransitionGroup className={css.items}>
                {users.map(u => (
                  <CSSTransition
                    key={u.id}
                    timeout={250}
                    classNames={{
                      exit: css.itemExitActive,
                      exitActive: css.itemExitActive
                    }}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      className={css.item}
                      onClick={() =>
                        this.addPolicyFor({
                          type: SubjectTypes.USER,
                          id: `${u.id}`
                        })
                      }
                    >
                      <span className={css.titleText}>{displayName(u)}</span>
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          ) : null}
        </div>
      </Fragment>
    );
  }
}

function permissionLevel(action: Action, editing?: boolean = false): string {
  switch (action) {
    case Actions.EDIT:
      return editing ? "Can Edit" : "Edit";

    case Actions.VIEW:
      return editing ? "Can View" : "View";

    case Actions.ADMIN:
      return editing ? "Is Owner" : "Owner";

    case Actions.NONE:
      return editing ? "Remove Access" : "";

    default:
      return "";
  }
}
