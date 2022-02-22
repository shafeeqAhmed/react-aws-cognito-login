// @flow
import { connect as connectRedux } from "react-redux";
import { bindActionCreators } from "redux";
import Component from "./setup";
import { ConnectDropTarget, DropTarget } from "react-dnd";
import { type Shot, type Setup, setTempSetup } from "src/redux/modules/shots";

export type DropTargetProps = {
  +hovered: boolean,
  +canDrop: boolean,
  +connectDropTarget: ConnectDropTarget
};

type OwnProps = {
  +shots: Array<Shot>,
  +setup: Setup
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
    component.setState({
      expanded: true
    });
    return {
      setupId: props.setup.id
    };
  },
  hover(props, monitor) {
    if (!props.shots.some(s => s.tempSetupId === props.setup.id)) {
      props.setTempSetup(monitor.getItem().id, props.setup.id);
    }
  }
};

const withDropTarget = component =>
  DropTarget("item", cardTarget, collect)(component);

const withRedux = component =>
  connectRedux(null, mapDispatchToProps)(component);

export default withRedux(withDropTarget(Component));

export type Props = DropTargetProps & OwnProps & DispatchProps;
