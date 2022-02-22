// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Fragment, PureComponent } from "react";
import { get } from "lodash";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import type { Props } from "./";

type State = {
  newFileName: string
};

export default class RenameFile extends PureComponent<Props, State> {
  state: State = {
    newFileName: ""
  };

  handleKeypressRenameFileName = (
    e: SyntheticKeyboardEvent<HTMLInputElement>
  ) => {
    if (e && e.key === "Enter") {
      e.preventDefault();
      this.handleChangeRenameFileName(e);
      this.handleRenameFile();
    }
  };

  handleChangeRenameFileName = (e: SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      newFileName: get(e, "target.value", "")
    });
  };

  handleRenameFile = () => {
    const { file, productionId, renameFile } = this.props;
    const { newFileName } = this.state;

    if (productionId && file) {
      renameFile(productionId, file.id, newFileName);
    }

    this.close();
  };

  close = () => {
    this.setState({
      newFileName: ""
    });

    this.props.onClose();
  };

  render() {
    const { file } = this.props;

    return (
      <Fragment>
        <DialogTitle id="rename-file-title">Rename</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="file-name"
            label="File Name"
            type="text"
            fullWidth
            onFocus={e => e.target.select()}
            defaultValue={get(file, "name", "")}
            onKeyPress={this.handleKeypressRenameFileName}
            onChange={this.handleChangeRenameFileName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.close} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.handleRenameFile} color="primary">
            Rename
          </Button>
        </DialogActions>
      </Fragment>
    );
  }
}
