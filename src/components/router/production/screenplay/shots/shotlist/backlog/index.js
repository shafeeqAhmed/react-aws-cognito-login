// @flow
import { connect as connectRedux } from "react-redux";
import { bindActionCreators } from "redux";
import Component from "./backlog";
import { ConnectDropTarget, DropTarget } from "react-dnd";
import { setTempSetup } from "src/redux/modules/shots";

export type DropTargetProps = {
  +connectDropTarget: ConnectDropTarget
};

type DispatchProps = {|
  +setTempSetup: typeof setTempSetup
|};

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      setTempSetup
    },
    dispatch
  );

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    monitor: monitor.getItem()
  };
}

const cardTarget = {
  drop(props, monitor, component) {
    return {
      setupId: "backlog"
    };
  },
  hover(props, monitor) {
    if (!props.shots.some(s => s.id === monitor.getItem().id)) {
      console.log("TEMP BACK");
      props.setTempSetup(monitor.getItem().id, "backlog");
    }
  }
};

const withDropTarget = component =>
  DropTarget("item", cardTarget, collect)(component);

const withRedux = component =>
  connectRedux(null, mapDispatchToProps)(component);

export default withRedux(withDropTarget(Component));
export type ReduxProps = DropTargetProps;
