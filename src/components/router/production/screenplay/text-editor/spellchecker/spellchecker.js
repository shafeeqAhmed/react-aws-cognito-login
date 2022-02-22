// @flow
import Typo from "typo-js";
import CodeMirror from "codemirror";
import aff from "static/dictionaries/en_US/en_US.aff";
import dic from "static/dictionaries/en_US/en_US.dic";

export type Options = {
  mode: string,
  wordSeparator: string,
  ignored: () => { [word: string]: boolean }
};

export default class SpellChecker {
  typo: Typo;

  options: Options = {
    mode: "spell-checker",
    wordSeparator: '!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ \uE000\uE001',
    ignored: () => ({})
  };

  constructor(options?: $Shape<Options>) {
    this.options = Object.assign({}, this.options, options);
    if (options && options.ignored) this.options.ignored = options.ignored;
    this.load("en_US");
  }

  load(lang: string = "en_US") {
    this.typo = new Typo(lang, aff, dic, { platform: "any" });
  }

  getSuggestions(token: string): Array<string> {
    return this.typo.suggest(token) || [];
  }

  defineMode() {
    const { wordSeparator, mode } = this.options;

    CodeMirror.defineMode(mode, config => {
      const overlay = {
        token: stream => {
          let ch = stream.peek();
          let word = "";

          if (wordSeparator.includes(ch)) {
            stream.next();
            return null;
          }

          // eslint-disable-next-line no-cond-assign
          while ((ch = stream.peek()) != null && !wordSeparator.includes(ch)) {
            word += ch;
            stream.next();
          }

          // ignore if there are no letters
          if (!/[a-z]/i.test(word)) return null;

          // ignore if word was added to dictionary
          const ignored = this.options.ignored();
          if (ignored[word]) return null;

          if (!this.typo.check(word)) {
            return "spell-error"; // assigns css class cm-spell-error.
          }

          return null;
        }
      };

      return CodeMirror.overlayMode(
        CodeMirror.getMode(config, config.backdrop || "screenplay"),
        overlay,
        true
      );
    });
  }
}
