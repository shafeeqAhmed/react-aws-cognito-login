// @flow
import React, { PureComponent } from "react";
import { FileTypes } from "src/redux/modules/drive";
import FolderIcon from "static/images/folderIcon.svg";
import ScreenplayIcon from "static/images/screenplayIcon.svg";
import type { Props } from "./";

export default class FileIcon extends PureComponent<Props> {
  render() {
    const { className, file } = this.props;
    if (!file) return null;

    switch (file.fileType) {
      case FileTypes.FOLDER:
        return (
          <img src={FolderIcon} className={className || null} alt={file.name} />
        );
      case FileTypes.SCREENPLAY:
        return (
          <img
            src={ScreenplayIcon}
            className={className || null}
            alt={file.name}
          />
        );
      case FileTypes.UPLOAD:
        return (
          <img
            src={ScreenplayIcon}
            className={className || null}
            alt={file.name}
          />
        );
      default:
        return null;
    }
  }
}
