// @flow
import { PureComponent, type Node } from "react";
import { CognitoStates } from "src/redux/modules/auth";

import type { ReduxProps } from "./";

type Props = ReduxProps & {
  children?: Node
};

export default class IfAuthenticated extends PureComponent<Props> {
  render() {
    const { children, cognitoState } = this.props;
    if (cognitoState !== CognitoStates.signedIn) return null;
    return children || null;
  }
}
