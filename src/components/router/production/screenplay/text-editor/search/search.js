// @flow
/* eslint no-param-reassign: 0, consistent-return: 0 */
import CodeMirror, { Cursor, Stream, MatchResult } from "codemirror";
import type { Pos, Mode, State } from "codemirror";
import { get } from "lodash";

export type SearchState = {
  posFrom: ?Pos,
  posTo: ?Pos,
  lastQuery: ?RegExp,
  query: ?RegExp,
  queryText: ?string,
  replacement: ?string,
  overlay: ?Mode,
  annotate: ?Object,
  searchPosition: ?[number, number]
};

export default class Search {
  cm: CodeMirror;
  state: SearchState;

  /**
   * @private
   */
  static parseString(str: string) {
    const q = str.replace(/\\(.)/g, (_, ch) => {
      if (ch === "n") return "\n";
      if (ch === "r") return "\r";
      return ch;
    });

    const caseInsensitive = q === q.toLowerCase();
    return new RegExp(
      q.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&"),
      caseInsensitive ? "gi" : "g"
    );
  }

  /**
   * @private
   */
  static parseQuery(str: string) {
    let q: RegExp;

    const isRE = str.match(/^\/(.*)\/([a-z]*)$/);
    if (isRE) {
      try {
        q = new RegExp(isRE[1], isRE[2].indexOf("i") === -1 ? "" : "i");
      } catch (e) {
        // Not a regular expression after all, do a string search
      }
    } else {
      q = this.parseString(str);
    }

    if (!q || q.test("")) q = /x^/;
    return q;
  }

  /**
   * @public
   */
  constructor(cm: CodeMirror) {
    this.cm = cm;
    this.loadState();
  }

  /**
   * @public
   */
  setQuery(queryText: string) {
    if (this.state.queryText && queryText !== this.state.queryText)
      this.clear();

    const query = this.constructor.parseQuery(queryText);
    this.setState({ queryText, query });

    return this;
  }

  /**
   * @public
   */
  setReplacement(q: string) {
    this.setState({ replacement: q });
    return this;
  }

  /**
   * @public
   */
  clear() {
    this.cm.operation(() => {
      const state = this.loadState();

      if (state.overlay) this.cm.removeOverlay(state.overlay);
      if (state.annotate) state.annotate.clear();

      this.setState({
        lastQuery: state.query,
        query: null,
        overlay: null,
        annotate: null
      });
    });

    return this;
  }

  /**
   * @public
   */
  find(reverse: boolean = false, persistent: boolean = false) {
    return this.cm.operation(() => {
      const state = this.loadState();
      if (!state.overlay) this.start();

      let cursor = this.getSearchCursor(reverse ? state.posFrom : state.posTo);

      if (!cursor || !cursor.find(reverse)) {
        cursor = this.getSearchCursor(
          reverse
            ? CodeMirror.Pos(this.cm.lastLine())
            : CodeMirror.Pos(this.cm.firstLine(), 0)
        );
        if (!cursor || !cursor.find(reverse)) {
          this.setState({ searchPosition: null });
          return false;
        }
      }

      this.cm.setSelection(cursor.from(), cursor.to());
      this.cm.scrollIntoView({ from: cursor.from(), to: cursor.to() }, 20);

      const searchPosition = this.getCurrentPosition(cursor.pos);

      this.setState({
        posFrom: cursor.from(),
        posTo: cursor.to(),
        searchPosition
      });

      if (!persistent) this.cm.focus();

      return true;
    });
  }

  getCurrentPosition(result: {
    from: Pos,
    to: Pos,
    match: ?MatchResult
  }): ?[number, number] {
    let currentMatch = 0;
    let numberOfMatches = 0;

    for (
      let cursor = this.getSearchCursor(CodeMirror.Pos(this.cm.firstLine(), 0));
      // eslint-disable-next-line no-unmodified-loop-condition
      cursor && cursor.findNext();

    ) {
      numberOfMatches += 1;

      if (
        cursor.pos.from.ch === result.from.ch &&
        cursor.pos.from.line === result.from.line &&
        cursor.pos.to.ch === result.to.ch &&
        cursor.pos.to.line === result.to.line
      ) {
        currentMatch = numberOfMatches;
      }
    }

    return numberOfMatches ? [currentMatch, numberOfMatches] : null;
  }

  /**
   * @public
   */
  replace = (all: boolean = false) => {
    if (all) return this.replaceAll();

    const advance = () => {
      const next = this.cm.operation(() => {
        const state = this.loadState();
        if (!state.overlay) this.start();

        if (!state.query) return;
        const replacement = state.replacement || "";

        // if a search result isn't already selected, select the next one.
        const currentFrom = this.cm.getCursor("from");
        const currentTo = this.cm.getCursor("to");

        if (
          !currentFrom ||
          !currentTo ||
          !state.posFrom ||
          !state.posTo ||
          currentFrom.line !== state.posFrom.line ||
          currentFrom.ch !== state.posFrom.ch ||
          currentTo.line !== state.posTo.line ||
          currentTo.ch !== state.posTo.ch
        ) {
          this.find(false, false);
          return false;
        }

        // if already at match, replace it
        const cursor = this.getSearchCursor(state.posFrom);
        if (!cursor) return false;

        // FIXME: get cursor at occurrence
        cursor.findPrevious();
        cursor.findNext();

        const match = cursor.pos.match;
        if (!match) return false;

        cursor.replace(replacement.replace(/\$(\d)/g, (_, i) => match[i]));
        this.setState({ searchPosition: this.getCurrentPosition(cursor.pos) });

        return true;
      });

      next && advance();
    };

    advance();
  };

  /**
   * @private
   */
  replaceAll = () =>
    this.cm.operation(() => {
      const state = this.loadState();
      if (!state.query) return false;

      const cursor = this.getSearchCursor();
      if (!cursor) return;

      // eslint-disable-next-line no-unmodified-loop-condition
      for (cursor; cursor && cursor.findNext(); ) {
        const match = this.cm
          .getRange(cursor.from(), cursor.to())
          .match(state.query);

        if (match) {
          cursor.replace(
            state.replacement.replace(/\$(\d)/g, (_, i) => match[i])
          );
        }
      }

      // update search position
      this.setState({ searchPosition: this.getCurrentPosition(cursor.pos) });

      return true;
    });

  /**
   * @private
   */
  setState(state: $Shape<SearchState>) {
    this.state = Object.assign({}, this.state, state);
    this.cm.state.search = this.state;
  }

  /**
   * @private
   */
  loadState() {
    const state = get(this, "cm.state.search", {
      posFrom: null,
      posTo: null,
      lastQuery: null,
      query: null,
      replacement: null,
      overlay: null,
      annotate: null,
      searchPosition: [0, 0]
    });

    this.state = state;
    return state;
  }

  /**
   * @private
   */
  overlay(): ?Mode {
    const { query } = this.state;
    if (!query) return;

    return {
      token: (stream: Stream, state: State): ?string => {
        query.lastIndex = stream.pos;
        const match = query.exec(stream.string);
        if (match && match.index === stream.pos) {
          stream.pos += match[0].length || 1;
          return "searching";
        } else if (match) {
          stream.pos = match.index;
        } else {
          stream.skipToEnd();
        }
      }
    };
  }

  /**
   * @private
   */
  getSearchCursor(pos?: Pos): ?Cursor {
    const { query } = this.state;
    if (!query) return;

    const caseFold = query.ignoreCase;
    const multiline = true;
    return this.cm.getSearchCursor(query, pos, { caseFold, multiline });
  }

  /**
   * @private
   */
  start() {
    const { state } = this;

    const { query } = state;
    if (!query) return;

    const overlay = this.overlay();
    if (overlay) {
      this.cm.addOverlay(overlay);
      this.setState({ overlay });
    }

    if (this.cm.showMatchesOnScrollbar) {
      if (state.annotate) {
        state.annotate.clear();
        this.setState({ annotate: null });
      }

      this.setState({
        annotate: this.cm.showMatchesOnScrollbar(query, query.ignoreCase)
      });
    }

    const cursor = this.cm.getCursor();
    this.setState({
      posFrom: cursor,
      posTo: cursor
    });
  }
}

CodeMirror.commands.findPersistentNext = (cm: CodeMirror) => {
  const search = new Search(cm);
  search.find(false, true);
};

CodeMirror.commands.findPersistentPrev = (cm: CodeMirror) => {
  const search = new Search(cm);
  search.find(true, true);
};

CodeMirror.commands.findNext = (cm: CodeMirror) => {
  const search = new Search(cm);
  search.find(false, false);
};

CodeMirror.commands.findPrev = (cm: CodeMirror) => {
  const search = new Search(cm);
  search.find(true, false);
};

CodeMirror.commands.clearSearch = (cm: CodeMirror) => {
  const search = new Search(cm);
  search.clear();
};

CodeMirror.commands.replace = (cm: CodeMirror) => {
  const search = new Search(cm);
  search.replace(false);
};

CodeMirror.commands.replaceAll = (cm: CodeMirror) => {
  const search = new Search(cm);
  search.replace(true);
};
