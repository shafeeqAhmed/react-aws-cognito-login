// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import hamburguerGreyIcon from "static/images/burger-grey.svg";
import css from "./categories.style.css";
import AddCategoryForm from "./addCategoryForm";
import Category from "./category";
import { type Props } from "./";

export default class CategorySidebar extends PureComponent<Props> {
  componentDidMount() {
    const { fetchElements, match, shootingEvent } = this.props;
    const { productionId } = match.params;
    if (!productionId || !shootingEvent) return;

    const shootingEventId = shootingEvent.id;

    fetchElements({
      productionId,
      shootingEventId
    });
  }

  componentDidUpdate(prevProps: Props) {
    const { fetchElements, match, shootingEvent } = this.props;
    const { productionId } = match.params;
    if (!productionId || !shootingEvent) return;
    const shootingEventId = shootingEvent.id;

    const { shootingEvent: prevShootingEvent, match: prevMatch } = prevProps;
    const { productionId: prevProductionId } = prevMatch.params;
    const prevShootingEventId = prevShootingEvent && prevShootingEvent.id;

    if (
      shootingEventId !== prevShootingEventId ||
      productionId !== prevProductionId
    ) {
      fetchElements({
        productionId,
        shootingEventId
      });
    }
  }

  renderManageCategoriesButton = () => (
    <Button
      classes={{
        root: css.manageCategoriesButton,
        label: css.manageCategoriesLabel
      }}
    >
      <img
        src={hamburguerGreyIcon}
        alt="hamburger"
        className={css.manageCategoriesIcon}
      />
      <span>Manage Categories</span>
    </Button>
  );

  render() {
    const {
      categories,
      toggleElementAnchor,
      removeElementAnchors
    } = this.props;

    return (
      <div className={css.categories}>
        <div className={css.content}>
          {categories.map(c => (
            <Category
              key={c.id}
              category={c}
              toggleElementAnchor={toggleElementAnchor}
              removeElementAnchors={removeElementAnchors}
            />
          ))}
        </div>
        <AddCategoryForm />
        <div className={css.footer} />
      </div>
    );
  }
}
