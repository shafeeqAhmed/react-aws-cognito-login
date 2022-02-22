// @flow
import { connect } from "react-redux";
import Component from "./renameFile";
import { renameFile } from "src/redux/modules/drive";
import type { File } from "src/redux/modules/drive";

type RouterProps = {};

type OwnProps = {
  onClose: Function,
  file: File
};

type StateProps = {
  +productionId: number
};

const mapStateToProps = (
  state: RootReducerState,
  props: OwnProps & RouterProps
): StateProps => ({
  productionId: state.productions.activeProductionID
});

/**
 * DispatchProps provide ways to mutate the state.
 */
type DispatchProps = {
  renameFile: typeof renameFile
};

const mapDispatchToProps: DispatchProps = {
  renameFile
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);

export type Props = RouterProps & OwnProps & StateProps & DispatchProps;
