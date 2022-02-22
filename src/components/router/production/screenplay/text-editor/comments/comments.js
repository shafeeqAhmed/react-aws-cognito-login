// @flow
/* eslint import/no-extraneous-dependencies: 0 */
import React, { type Node, Component } from "react";
import { find, map, filter } from "lodash";
import addCommentIcon from "static/images/leaveCommentIcon.svg";
import IconButton from "@material-ui/core/IconButton";
import NewComment from "./new-comment";
import Comment from "./comment";
import css from "./comments.style.css";
import type { Props } from "./";

type State = {
  height: number,
  addCommentButtonPosition: number,
  scrollTop: number,
  show: boolean,
  focused: boolean
};

export default class Comments extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      height: props.mirror.getScrollInfo().height,
      addCommentButtonPosition: 0,
      scrollTop: 0,
      show: false,
      screenplayThreads: [],
      focused: false
    };
  }
  container: Node;

  componentDidMount = () => {
    const {
      mirror,
      productionId,
      screenplayId,
      getComments,
      connectAndSubscribe
    } = this.props;
    if (productionId && screenplayId) {
      getComments(productionId, screenplayId);
      connectAndSubscribe(productionId, screenplayId);
    }

    mirror.on("update", () => {
      if (this.state.height !== mirror.getScrollInfo().height) {
        this.setState({
          height: mirror.getScrollInfo().height
        });
      }
    });

    mirror.on("cursorActivity", () => {
      const { show } = this.state;

      // $FlowFixMe
      if (mirror.somethingSelected() && !show) {
        const cursor = mirror.getCursor("from");

        this.setState({
          show: true,
          addCommentButtonPosition:
            // $FlowFixMe
            mirror.cursorCoords({ line: cursor.line, ch: cursor.ch }, "local")
              .top - 10
        });
        // $FlowFixMe
      } else if (!mirror.somethingSelected() && show) {
        this.setState({
          show: false
        });
        this.props.toggleAddingNewComment(false);
      }
    });

    mirror.on("scroll", data => {
      this.container.scrollTop = mirror.getScrollInfo().top;
    });
  };

  getCommentPosition = (id: number) => {
    const thread = find(this.props.screenplayThreads, { id: id.toString() });

    if (thread) {
      // $FlowFixMe
      return this.props.mirror.cursorCoords({ line: thread.line }, "local").top;
    }

    return 0;
  };

  preventKeyboardScroll = (e: SyntheticKeyboardEvent<*>) => {
    if (!this.state.focused && [32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  };

  componentWillReceiveProps = (nextProps: Props) => {
    if (
      (nextProps.selectedThreadId &&
        this.props.selectedThreadId !== nextProps.selectedThreadId) ||
      (this.props.selectedThreadId && !nextProps.selectedThreadId)
    ) {
      if (nextProps.selectedThreadId) {
        this.props.pad.setSelectedThread(nextProps.selectedThreadId.toString());
      } else {
        this.props.pad.clearSelectedThread();
      }
    }
  };

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.comments.length !== this.props.comments.length) {
      this.container.scrollBy(0, 100);
      this.container.scrollBy(0, -100);
    }
  };

  componentWillUnmount = () => {
    const { mirror, disconnect } = this.props;
    disconnect();
    mirror.off("update");
    mirror.off("cursorActivity");
    mirror.off("scroll");
  };

  addNewComment = () => {
    this.props.toggleAddingNewComment(true);
  };

  handleCancel = () => {
    this.props.toggleAddingNewComment(false);
  };

  handleComment = (commentId: number) => {
    this.props.pad.anchorThread(`${commentId}`);
    this.props.toggleAddingNewComment(false);
  };

  handleFocus = () => {
    this.setState({
      focused: true
    });
  };

  handleBlur = () => {
    this.setState({
      focused: false
    });
    this.props.toggleAddingNewComment(false);
  };

  handleScroll = () => {
    this.props.mirror.scrollTo(0, this.container.scrollTop);
  };

  renderComments = () => {
    const { comments, screenplayThreads, selectedThreadId } = this.props;

    const threadIds = map(screenplayThreads, thread => parseInt(thread.id, 10));

    return filter(comments, comment => threadIds.includes(comment.id)).map(
      comment => (
        <Comment
          key={comment.id}
          position={this.getCommentPosition(comment.id)}
          comment={comment}
          selectedThreadId={selectedThreadId}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
      )
    );
  };

  handleClick = () => {
    this.props.updateSelectedThreadId();
  };

  render() {
    const { addCommentButtonPosition, show } = this.state;
    const {
      isAddingNewComment,
      showComments,
      screenplayId,
      selectedThreadId
    } = this.props;

    return (
      <div
        onWheel={this.handleScroll}
        onScroll={this.handleScroll}
        onClick={this.handleClick}
        // onKeyDown={this.preventKeyboardScroll}
        role="presentation"
        /* eslint-disable-next-line */
        tabIndex="-1"
        ref={container => {
          this.container = container;
        }}
        className={css.container}
        style={{
          backgroundColor: !showComments ? "transparent" : undefined
        }}
      >
        <div style={{ ...this.state }}>
          {!!show &&
            !selectedThreadId &&
            (!isAddingNewComment ? (
              <IconButton
                key="addComment"
                aria-label="Add Comment"
                color="inherit"
                style={{
                  top: addCommentButtonPosition
                }}
                onClick={this.addNewComment}
                className={css.addCommentButton}
              >
                <img src={addCommentIcon} alt="leave comment" />
              </IconButton>
            ) : (
              <div
                className={css.newComment}
                style={{
                  top: addCommentButtonPosition
                }}
              >
                <NewComment
                  screenplayId={screenplayId}
                  onCancel={this.handleCancel}
                  onComment={this.handleComment}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                />
              </div>
            ))}
          {this.renderComments()}
        </div>
      </div>
    );
  }
}
