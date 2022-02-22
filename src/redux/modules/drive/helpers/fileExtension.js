// @flow
import { FileTypes, type File } from "src/redux/modules/drive";

export default function fileExtension(file: File): string {
  switch (file.fileType) {
    case FileTypes.FOLDER:
      return "";

    case FileTypes.SCREENPLAY:
      return ".pscd";

    case FileTypes.UPLOAD:
    default: {
      const segments = file.name.split(".");
      if (segments.length <= 1) return "";
      return `.${segments[segments.length - 1]}`;
    }
  }
}
