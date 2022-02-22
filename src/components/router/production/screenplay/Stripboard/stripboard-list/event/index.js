// @flow
import { connect as connectRedux } from "react-redux";
import { bindActionCreators } from "redux";
import last from "lodash/last";
import moment from "moment";
import Component from "./event";
import { findDOMNode } from "react-dom";
import {
  DragSource,
  DropTarget,
  ConnectDropTarget,
  ConnectDragSource,
  DropTargetMonitor,
  DropTargetConnector,
  DragSourceConnector,
  DragSourceMonitor
} from "react-dnd";
import {
  type ShootingEvent,
  removeEventFromNotScheduled
} from "src/redux/modules/shooting/events";
import {
  createScheduleDayEvent,
  fetchScheduleDays
} from "src/redux/modules/schedule/days";
import { type ScheduleDayEvent } from "src/redux/modules/schedule/events";
import { type State as ColorsState } from "src/redux/modules/colors";

type OwnProps = {
  id: string,
  index: number,
  +item: ShootingEvent,
  +currentDayEvent: ?ScheduleDayEvent,
  +locations?: $PropertyType<ScheduleDayEvent, "locations">,
  +selectDayEvent: Function,
  +productionId: string,
  +colors: $PropertyType<ColorsState, "list">
};

type CardSourceCollectedProps = {
  isDragging: boolean,
  connectDragSource: ConnectDragSource
};

type CardTargetCollectedProps = {
  connectDropTarget: ConnectDropTarget
};

type DispatchProps = {|
  +removeEventFromNotScheduled: typeof removeEventFromNotScheduled,
  +createScheduleDayEvent: typeof createScheduleDayEvent,
  +fetchScheduleDays: typeof fetchScheduleDays
|};

export type Props = OwnProps &
  CardSourceCollectedProps &
  CardTargetCollectedProps &
  DispatchProps;

const mapDispatchToProps = (dispatch: GlobalDispatch<*>): DispatchProps =>
  bindActionCreators(
    {
      removeEventFromNotScheduled,
      createScheduleDayEvent,
      fetchScheduleDays
    },
    dispatch
  );

const cardSource = {
  beginDrag(props: Props) {
    return {
      id: props.item.id,
      index: props.index,
      dayId: props.item.id
    };
  },
  endDrag(props: Props, monitor: any) {
    if (monitor.getDropResult()) {
      const dayId = monitor.getDropResult().dayId;
      const day = monitor.getDropResult().day;
      const events = monitor.getDropResult().events;

      if (!day) return;

      let calendarStart = day.call_time;
      let calendarEnd = "";

      if (events.length > 0) {
        const endOfDay = last(events).calendar_end;
        calendarStart = moment(endOfDay).format("YYYY-MM-DDTHH:mm:ssZ");
      }

      calendarEnd = moment(calendarStart)
        .add(moment.duration(props.item.duration_time))
        .format("YYYY-MM-DDTHH:mm:ssZ");

      const request = {
        productionId: props.productionId,
        screenplayId: props.item.screenplay_id,
        scheduledayId: dayId,
        shootingeventId: props.item.id,
        isPaid: true,
        isFixed: false,
        calendarStart,
        calendarEnd
      };

      // $FlowFixMe this action is a promise
      props.createScheduleDayEvent(request).then(() => {
        props.fetchScheduleDays({
          productionId: props.productionId,
          screenplayId: props.item.screenplay_id
        });
      });
      props.removeEventFromNotScheduled(props.item.id);
    }
  }
};

const cardTarget = {
  hover(props: Props, monitor: DropTargetMonitor, component: ?Component) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return null;
    }

    // Determine rectangle on screen
    // eslint-disable-next-line react/no-find-dom-node
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return null;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return null;
    }

    // Time to actually perform the action
    // props.moveShot(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // eslint-disable-next-line no-param-reassign
    monitor.getItem().index = hoverIndex;
    return null;
  }
};

const withDragSource = component =>
  DropTarget(
    "stripboardItem",
    cardTarget,
    (connect: DropTargetConnector, monitor: any) => ({
      connectDropTarget: connect.dropTarget()
    })
  )(
    DragSource(
      "stripboardItem",
      cardSource,
      (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
      })
    )(component)
  );

const withRedux = component =>
  connectRedux(null, mapDispatchToProps)(component);

export default withRedux(withDragSource(Component));
