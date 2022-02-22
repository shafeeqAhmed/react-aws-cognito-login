// @flow

export { default } from "./contextmenu";

export type Item = {
  key: string,
  caption: string,
  onClick?: Function,
  menuItems?: Array<Item>
};

export type Props = {
  open?: boolean,
  anchorEl?: ?HTMLElement,
  onClose?: Function,
  menuItems: Array<Item>
};
