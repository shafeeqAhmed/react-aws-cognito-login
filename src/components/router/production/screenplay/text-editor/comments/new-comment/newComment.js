// @flow
/* eslint import/no-extraneous-dependencies: 0 */
import React, { type Node, Component } from "react";
import { get, map } from "lodash";
import { MentionsInput, Mention } from "src/components/shared/Mentions";
import tickIcon from "static/images/tick.svg";
import hashIcon from "static/images/hashtag.svg";
import smileIcon from "static/images/smile.svg";
import moment from "moment";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import css from "./newComment.style.css";
import type { UserProfile } from "src/redux/modules/users";
import type { Props } from "./";

type State = {
  message: string,
  focused: boolean
};

export default class NewComment extends Component<Props, State> {
  state = {
    message: "",
    focused: false
  };

  handleComment = async () => {
    console.log("handleComment");

    const {
      newComment,
      activeProductionID,
      screenplayId,
      onComment
    } = this.props;
    const { message } = this.state;

    console.log("activeProductionID", activeProductionID);

    if (activeProductionID && onComment) {
      const res = await newComment(activeProductionID, screenplayId, message);
      const messageId = get(res, "action.payload.data.message.id");
      if (messageId) onComment(messageId);
    }
  };

  hanldeKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      this.handleComment();
      e.preventDefault();
    }
  };

  handleChange = (e: SyntheticInputEvent<>) => {
    this.setState({
      message: e.target.value
    });
  };

  handleFocus = () => {
    this.setState({
      focused: true
    });

    this.props.onFocus();
  };

  handleBlur = () => {
    this.setState({
      focused: false
    });

    this.props.onBlur();
  };

  renderUserSuggestion = (
    user: UserProfile,
    search: ?string,
    highlightedDisplay: Node,
    index: number,
    focused: boolean
  ) => {
    const role = get(user, "roles[0].name", "Producer");

    return (
      <div
        className={`${css.userSuggestion} ${focused ? css.highlighted : ""}`}
      >
        <div className={css.userSuggestionAvatar} />
        <div className={css.userSuggestionName}>
          {user.firstName} {user.lastName}
        </div>
        <div className={css.userSuggestionRole}>{role}</div>
      </div>
    );
  };

  renderSuggestionHeader = () => (
    <div className={css.suggestionHeader}>Mention person or group</div>
  );

  render() {
    const { users, currentUser } = this.props;
    const { message, focused } = this.state;

    const userMentions = map(users, user => {
      const mention = user;
      mention.display = user.lastName;
      return mention;
    });

    const role = get(currentUser, "roles[0].name", "Writer");

    return (
      <ClickAwayListener onClickAway={this.handleBlur}>
        <div className={css.container}>
          <div className={css.header}>
            <div className={css.avatar} />
            <div className={css.name}>
              {currentUser && currentUser.lastName}
            </div>
            <div className={css.grayText}>{`${role} · ${moment().format(
              "hh:mm A"
            )}`}</div>
          </div>
          <div
            className={css.textBar}
            style={{
              backgroundColor: focused ? "#fffcde" : "#fff"
            }}
          >
            <MentionsInput
              value={message}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              // onBlur={this.handleBlur}
              className={css.input}
              header={this.renderSuggestionHeader()}
              autoFocus
              suggestionsStyle={{
                border: "1px solid #C3D9E8",
                margin: 0,
                height: 200,
                overflowY: "scroll"
              }}
            >
              <Mention
                trigger="@"
                data={userMentions}
                className={css.userMention}
                renderSuggestion={this.renderUserSuggestion}
                appendSpaceOnAdd
              />
            </MentionsInput>
            <button
              className={css.sendMessageButton}
              onClick={this.handleComment}
            >
              <img src={tickIcon} alt="send" className={css.tickIcon} />
            </button>
            <div className={css.iconsContainer}>
              <button className={css.inputButton}>
                <img src={hashIcon} alt="topic" className={css.inputIcon} />
              </button>
              <button className={css.inputButton}>
                <img src={smileIcon} alt="reaction" className={css.inputIcon} />
              </button>
            </div>
          </div>
        </div>
      </ClickAwayListener>
    );
  }
}
