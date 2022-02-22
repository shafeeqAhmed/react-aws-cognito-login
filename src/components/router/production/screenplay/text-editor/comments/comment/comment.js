// @flow
/* eslint import/no-extraneous-dependencies: 0 */
import React, { Component } from "react";
import { get, map } from "lodash";
import moment from "moment";
import Button from "@material-ui/core/Button";
import elypsisIcon from "static/images/elypsisComment.svg";
import tickIcon from "static/images/tick.svg";
import hashIcon from "static/images/hashtag.svg";
import smileIcon from "static/images/smile.svg";
import {
  displayName,
  mentionName,
  type UserProfile
} from "src/redux/modules/users";
import { type Comment } from "src/redux/modules/comments";
import { MentionsInput, Mention } from "src/components/shared/Mentions";
import css from "./comment.style.css";
import { type Props } from "./";

type State = {
  reply: string,
  showReplies: boolean,
  hover: boolean,
  inputFocused: boolean
};

export default class CommentComponent extends Component<Props, State> {
  state = {
    reply: "",
    showReplies: true,
    hover: false,
    inputFocused: false
  };

  componentDidMount() {
    const { fetchReplies, comment } = this.props;
    fetchReplies(comment.id);
  }

  componentDidUpdate(prevProps: Props) {
    const { fetchReplies, comment } = this.props;

    if (
      comment.id &&
      comment.id !== get(prevProps, "comment.id") &&
      !!get(comment, "thread.replies")
    ) {
      fetchReplies(comment.id);
    }
  }

  // TODO: should this be using https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops or componentDidUpdate?
  componentWillReceiveProps = (nextProps: Props) => {
    if (
      this.props.selectedThreadId !== nextProps.selectedThreadId &&
      !nextProps.selectedThreadId
    ) {
      this.setState({
        showReplies: false
      });
    }
  };

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      reply: e.target.value
    });
  };

  // TODO: actually reply
  hanldeKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      e.preventDefault();

      const message = ((e.target: any): HTMLInputElement).value;
      this.props.reply(this.props.comment.id, message);

      this.setState({ reply: "" });
    }
  };

  toggleReplies = () => {
    this.setState((state: State) => ({
      showReplies: !state.showReplies
    }));
  };

  handleFocus = (id: number) => {
    this.props.updateSelectedThreadId(id.toString());
  };

  handleMouseEnter = () => {
    this.setState({
      hover: true
    });
  };

  handleMouseLeave = () => {
    this.setState({
      hover: false
    });
  };

  handleInputFocus = () => {
    this.setState({
      inputFocused: true
    });
    this.props.onFocus();
  };
  handleInputBlur = () => {
    this.setState({
      inputFocused: false
    });
    this.props.onBlur();
  };

  formatMentions = (message: string): string => {
    const regexMention = /(@)(\[)(.)*(\])(\()(.)*(\))/gm;
    const regexName = /(@)(\[)(.)*(\])/gm;

    const mentions = message.match(regexMention);
    let text = message;

    if (mentions) {
      mentions.forEach(mention => {
        const match = mention.match(regexName);
        const name = match && match[0].substring(2, match[0].length - 1);

        text = text.replace(regexMention, `<span>${name || ""}</span>`);
      });
      return text;
    }
    return message;
  };

  renderReplies = (): Node => {
    const { selectedThreadId, comment, replies } = this.props;
    const { showReplies } = this.state;

    const isSelected = selectedThreadId === comment.id.toString();

    if (isSelected && showReplies)
      return replies.map((reply: Comment) => (
        <div key={reply.id} className={css.reply}>
          <div className={css.header}>
            <div className={css.avatar} />
            <div className={css.name}>{displayName(reply.user)}</div>
            <div className={css.grayText}>{`${"Writer"} · ${moment().format(
              "hh:mm A"
            )}`}</div>
          </div>
          <div
            className={css.message}
            dangerouslySetInnerHTML={{
              __html: this.formatMentions(reply.message)
            }}
          />
        </div>
      ));
    else if (isSelected && !!replies.length)
      return (
        <div className={css.reply}>
          <div className={css.header}>
            <div className={css.avatar} />
            <div className={css.name}>{displayName(comment.user)}</div>
            <div className={css.grayText}>{`${"Writer"} · ${moment().format(
              "hh:mm A"
            )}`}</div>
          </div>
          <div
            className={css.message}
            dangerouslySetInnerHTML={{
              __html: this.formatMentions(
                get(replies, `${replies.length - 1}.message`, "")
              )
            }}
          />
        </div>
      );
    return null;
  };

  renderInput = () => {
    const { selectedThreadId, comment, replies, users } = this.props;
    const { reply, inputFocused } = this.state;
    const isSelected = selectedThreadId === comment.id.toString();

    const userMentions = map(users, user => {
      const mention = user;
      mention.display = mentionName(user);
      return mention;
    });

    return (
      <div
        className={`${css.textBar} ${!isSelected ? css.hidden : ""}  ${
          !replies.length ? css.inputLarge : ""
        }`}
        style={{
          backgroundColor: inputFocused ? "#fffcde" : "#fff"
        }}
      >
        <MentionsInput
          value={reply}
          onChange={this.handleChange}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          className={css.input}
          placeholder="Add Reply..."
          onKeyDown={this.hanldeKeyDown}
          header={this.renderSuggestionHeader()}
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
        <button className={css.sendMessageButton}>
          <img src={tickIcon} alt="send" className={css.tickIcon} />
        </button>
        <div className={css.iconsContainer}>
          <button className={css.inputButton}>
            <img src={hashIcon} alt="send" className={css.inputIcon} />
          </button>
          <button className={css.inputButton}>
            <img src={smileIcon} alt="send" className={css.inputIcon} />
          </button>
        </div>
      </div>
    );
  };

  renderUserSuggestion = (
    user: UserProfile,
    search: ?string,
    highlightedDisplay: Node,
    index: number,
    focused: boolean
  ) => {
    const role = get(user, "roles[0].name", "");

    return (
      <div
        className={`${css.userSuggestion} ${focused ? css.highlighted : ""}`}
      >
        <div className={css.userSuggestionAvatar} />
        <div className={css.userSuggestionName}>{displayName(user)}</div>
        <div className={css.userSuggestionRole}>{role}</div>
      </div>
    );
  };

  renderSuggestionHeader = () => (
    <div className={css.suggestionHeader}>Mention person or group</div>
  );

  render() {
    const { comment, position, selectedThreadId } = this.props;
    const { showReplies, hover } = this.state;

    const isSelected = selectedThreadId === comment.id.toString();

    return (
      <div
        className={css.container}
        style={{
          top: position,
          borderLeft: isSelected ? "5px solid #6e8af4" : undefined,
          zIndex: isSelected ? 2 : 0
        }}
        role="presentation"
        onFocus={() => this.handleFocus(comment.id)}
        onClick={e => e.stopPropagation()}
        tabIndex="-1"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className={css.header}>
          <div className={css.avatar} />
          <div className={css.name}>{displayName(comment.user)}</div>
          <div className={css.grayText}>{`${"Writer"} · ${moment(
            comment.time
          ).format("hh:mm A")}`}</div>
          {hover ? (
            <div className={`${css.resolveText} ${css.resolveHover}`}>
              <span>Resolve</span>
              <Button
                classes={{
                  root: css.elypsisButton
                }}
                disableRipple
              >
                <img src={elypsisIcon} alt="more" className={css.elypsisIcon} />
              </Button>
            </div>
          ) : (
            <div className={css.resolveText}>
              <span>Resolve</span>
            </div>
          )}
        </div>
        <div
          className={css.message}
          dangerouslySetInnerHTML={{
            __html: this.formatMentions(comment.message)
          }}
        />
        {!!get(comment, "thread.replies", 0) && (
          <div className={css.repliesNumberContainer}>
            <div className={css.repliesNumber}>
              {get(comment, "thread.replies", 0)}{" "}
              {get(comment, "thread.replies", 0) === 1 ? "Reply" : "Replies"}
            </div>
            {isSelected && get(comment, "thread.replies", 0) > 1 ? (
              <button className={css.showPrevious} onClick={this.toggleReplies}>
                {!showReplies
                  ? `View ${get(comment, "thread.replies", 0) -
                      1} Previous Replies`
                  : "View Less"}
              </button>
            ) : null}
          </div>
        )}
        <div className={css.repliesContainer}>
          <div className={css.replies}>{this.renderReplies()}</div>
          {this.renderInput()}
        </div>
      </div>
    );
  }
}
