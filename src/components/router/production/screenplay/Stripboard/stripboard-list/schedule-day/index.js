// @flow
// import { connect as connectRedux } from "react-redux";
// import { bindActionCreators } from "redux";
import Component from "./schedule-day";
import { ConnectDropTarget, DropTarget } from "react-dnd";
import type { ScheduleDayEvent } from "src/redux/modules/schedule/events";
import { type State as ColorsState } from "src/redux/modules/colors";
import type { Day } from "src/redux/modules/schedule/days";

export type DropTargetProps = {
  +hovered: boolean,
  +canDrop: boolean,
  +connectDropTarget: ConnectDropTarget
};

type OwnProps = {
  +events: Array<ScheduleDayEvent>,
  +day: Day,
  +currentDayEvent: ?ScheduleDayEvent,
  +selectDayEvent: Function,
  +colors: $PropertyType<ColorsState, "list">
};

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
      dayId: props.day.id,
      events: props.day.schedule_day_events,
      day: props.day
    };
  }
  // TODO: Expand schedule day when hovering
  // hover(props, monitor) {
  // if (!props.shots.some(s => s.tempSetupId === props.setup.id)) {
  //   props.setTempSetup(monitor.getItem().id, props.setup.id);
  // }
  // }
};

const withDropTarget = component =>
  DropTarget("stripboardItem", cardTarget, collect)(component);

// const withRedux = component =>
//   connectRedux(null, mapDispatchToProps)(component);

// export default withRedux(withDropTarget(Component));
export default withDropTarget(Component);

export type Props = DropTargetProps & OwnProps;
