// @flow
import { type File } from "src/redux/modules/drive";
import Component from "./fileIcon";

type OwnProps = {
  +file: File,
  +className?: string
};

export default Component;
export type Props = OwnProps;
