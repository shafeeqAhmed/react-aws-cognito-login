// @flow
/* eslint-disable import/no-extraneous-dependencies,import/no-duplicates */
import React, { PureComponent } from "react";
import { get } from "lodash";
import filesize from "filesize";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import LinearProgress from "@material-ui/core/LinearProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import Close from "@material-ui/icons/Close";
import classNames from "classnames";
import css from "./uploader.style.css";
import type { Props } from "./";

type State = {
  open: boolean
};

export default class Uploader extends PureComponent<Props, State> {
  state: State = {
    open: false
  };

  static normalize(loaded: number, total: number): number {
    if (total === 0) return 0;
    return Math.min(loaded * 100 / total, 100);
  }

  progress() {
    const { sounds } = this.props;

    const progress = sounds.reduce(
      (all, one) => {
        all.total += one.upload.total; // eslint-disable-line no-param-reassign
        all.loaded += one.upload.loaded; // eslint-disable-line no-param-reassign
        return all;
      },
      { total: 0, loaded: 0 }
    );

    return Uploader.normalize(progress.loaded, progress.total);
  }

  toggleOpen = (e: Event) => {
    this.setState((state: State) => ({
      open: !state.open
    }));
  };

  dismissUpload = (soundId: ?string) => {
    const { dismissUpload } = this.props;
    if (soundId) {
      dismissUpload({ soundId });
    }
  };

  dismissUploads = () => {
    const { sounds, dismissUpload } = this.props;

    return sounds.forEach(s => {
      dismissUpload({ soundId: s.id });
    });
  };

  render() {
    const { sounds } = this.props;
    if (!sounds.length) return null;

    const progress = this.progress();

    const { open } = this.state;

    return (
      <div className={css.root}>
        <Paper
          classes={{
            root: css.paper
          }}
        >
          <div className={css.overview}>
            <div className={css.title}>
              <span className={css.titleText}>
                {progress === 100 ? "Complete" : "Uploading"}
              </span>
            </div>
            <div className={css.progressBar}>
              <LinearProgress
                variant="determinate"
                value={progress}
                classes={{
                  root: css.progressBarDeterminate,
                  bar1Determinate: css.progressBar1Determinate,
                  bar2Indeterminate: css.progressBar2Indeterminate
                }}
              />
            </div>
            <div className={css.actions}>
              <IconButton
                className={classNames({
                  [css.buttonIconOuter]: true,
                  [css.buttonIconChevron]: true
                })}
                onClick={this.toggleOpen}
              >
                <ChevronLeft
                  className={css.buttonIconInner}
                  style={{
                    transform: open
                      ? "rotate(90deg) scale(1.2)"
                      : "rotate(-90deg) scale(1.2)"
                  }}
                />
              </IconButton>
              <IconButton
                className={css.buttonIconOuter}
                onClick={this.dismissUploads}
              >
                <Close className={css.buttonIconInner} />
              </IconButton>
            </div>
          </div>
          {open && (
            <div className={css.uploads}>
              <Table className={css.table}>
                <TableBody>
                  {sounds.map(s => {
                    const p = Uploader.normalize(
                      s.upload.loaded,
                      s.upload.total
                    );

                    return (
                      <TableRow
                        key={s.id}
                        classes={{
                          root: css.tableRow
                        }}
                      >
                        <TableCell
                          component="td"
                          scope="row"
                          padding="none"
                          classes={{
                            root: css.fileNameTableCell
                          }}
                        >
                          <span className={css.fileName}>{s.name}</span>
                        </TableCell>
                        <TableCell
                          component="td"
                          scope="row"
                          padding="none"
                          classes={{
                            root: css.fileSizeTableCell
                          }}
                        >
                          <span className={css.fileSize}>
                            {filesize(get(s, "upload.total", 0))}
                          </span>
                        </TableCell>
                        <TableCell
                          component="td"
                          scope="row"
                          padding="none"
                          classes={{
                            root: css.progressTableCell
                          }}
                        >
                          <span className={css.progress}>{Math.floor(p)}%</span>
                        </TableCell>
                        <TableCell
                          component="td"
                          scope="row"
                          padding="none"
                          classes={{
                            root: css.actionsTableCell
                          }}
                        >
                          <IconButton
                            className={css.closeActionButton}
                            onClick={() => this.dismissUpload(s.id)}
                          >
                            <Close className={css.closeActionIcon} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </Paper>
      </div>
    );
  }
}
