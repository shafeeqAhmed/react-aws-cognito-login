// @flow
import React, { PureComponent } from "react";
import Toolbar from "src/components/shared/toolbar";
import StripboardList from "./stripboard-list";
import RightSidebar from "./right-sidebar";
import css from "./Stripboard.style.css";
import type { Props } from "./";

export default class Stripboard extends PureComponent<Props> {
  componentDidMount = () => {
    const {
      productionId,
      screenplayId,
      unitId,
      fetchScheduleDays,
      fetchNotScheduledEvents,
      fetchColors
    } = this.props;
    fetchScheduleDays({ productionId, screenplayId });
    fetchColors({ productionId });
    if (unitId) {
      fetchNotScheduledEvents({ productionId, unitId });
    }
  };

  componentWillReceiveProps = (nextProps: Props) => {
    if (
      (!this.props.unitId && nextProps.unitId) ||
      this.props.unitId !== nextProps.unitId
    ) {
      const { productionId, fetchNotScheduledEvents } = this.props;
      const { unitId } = nextProps;
      fetchNotScheduledEvents({ productionId, unitId });
    }
  };

  createNew = () => Promise.resolve();
  clearSearch = () => Promise.resolve();
  doSearch = () => Promise.resolve();
  publishChanges = () => Promise.resolve();

  selectDayEvent = (currentDayEventId: string, shootingEventId: string) => {
    const {
      fetchElements,
      selectDayEvent,
      setStripboardSidebarMode,
      productionId
    } = this.props;

    fetchElements({ productionId, shootingEventId });
    selectDayEvent(currentDayEventId);
    setStripboardSidebarMode("details");
  };

  render() {
    const {
      currentDayEvent,
      currentCategories,
      stripboardSidebarMode,
      stripboardSearchResults,
      shootingEvents,
      days,
      productionId,
      colors
    } = this.props;

    return (
      <div className={css.stripboard}>
        <Toolbar
          type="stripboard"
          publishChanges={this.publishChanges}
          createNew={this.createNew}
          createNewAltText="New Scene"
          search={this.doSearch}
          clearSearch={this.clearSearch}
        />
        <div className={css.belowToolbar}>
          <div className={css.table}>
            <div className={css.columnTitles}>
              <div className={css.ten}>Scene #</div>
              <div className={css.thirtyFive}>Scene Description</div>
              <div className={css.twenty}>Cast</div>
              <div className={css.five}>BG</div>
              <div className={css.ten}>Location</div>
              <div className={css.ten}>Vehicles</div>
              <div className={css.five}>Pages</div>
              <div className={css.five}>Time</div>
            </div>
            <div className={css.content}>
              <StripboardList
                shootingEvents={shootingEvents}
                currentDayEvent={currentDayEvent}
                selectDayEvent={this.selectDayEvent}
                days={days}
                productionId={productionId}
                colors={colors}
              />
            </div>
          </div>
          <RightSidebar
            currentDayEvent={currentDayEvent}
            currentCategories={currentCategories}
            stripboardSidebarMode={stripboardSidebarMode}
            stripboardSearchResults={stripboardSearchResults}
          />
        </div>
      </div>
    );
  }
}
