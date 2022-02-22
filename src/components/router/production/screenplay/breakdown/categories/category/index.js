// @flow
import Component from "./category";
import { type CategoryWithElements } from "src/redux/modules/categories";

type OwnProps = {|
  category: CategoryWithElements,
  toggleElementAnchor: Function,
  removeElementAnchors: Function
|};

export default Component;
export type Props = OwnProps & {};
