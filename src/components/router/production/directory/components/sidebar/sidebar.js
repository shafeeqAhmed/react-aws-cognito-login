// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import classNames from "classnames";
import css from "./sidebar.style.css";
import { CategoryTypes } from "src/redux/modules/categories";
import type { Props } from "./";

// icons
import CastActiveIcon from "static/images/castActiveIcon.svg";
import CastIcon from "static/images/castIcon.svg";
import CrewActiveIcon from "static/images/crewActiveIcon.svg";
import CrewIcon from "static/images/crewIcon.svg";
import ExtrasActiveIcon from "static/images/extrasActiveIcon.svg";
import ExtrasIcon from "static/images/extrasIcon.svg";
import NetworkActiveIcon from "static/images/networkActiveIcon.svg";
import NetworkIcon from "static/images/networkIcon.svg";
import ReportsIcon from "static/images/reports.svg";
import AddNewIcon from "static/images/add-green-dk.svg";

const peopleSectionIcons = {
  [CategoryTypes.CREW]: {
    active: CrewActiveIcon,
    nonActive: CrewIcon
  },
  [CategoryTypes.CAST]: {
    active: CastActiveIcon,
    nonActive: CastIcon
  },
  [CategoryTypes.EXTRAS]: {
    active: ExtrasActiveIcon,
    nonActive: ExtrasIcon
  },
  [CategoryTypes.STUNTS]: {
    active: NetworkActiveIcon,
    nonActive: NetworkIcon
  }
};

export default class Sidebar extends PureComponent<Props> {
  handleClick = (e: Event, type: string, id: string) => {
    e.preventDefault();

    const {
      history,
      active,
      match: {
        params: { productionId }
      }
    } = this.props;

    if (id === active) return false;

    switch (type) {
      case CategoryTypes.DIGITAL:
        history.push(`/${productionId}/directory/digital/${id}`);
        break;
      case CategoryTypes.PHYSICAL:
      case "custom":
        history.push(`/${productionId}/directory/physical/${id}`);
        break;

      default:
        history.push(`/${productionId}/directory/${id}`);
    }

    return false;
  };

  render() {
    const { active, categories } = this.props;
    const physical = categories.filter(c =>
      [CategoryTypes.PHYSICAL, "custom"].includes(c.type)
    );
    const digital = categories.filter(c =>
      [CategoryTypes.DIGITAL].includes(c.type)
    );

    return (
      <div className={css.sidebar}>
        <div className={css.people}>
          <div className={css.sectionTitle}>PEOPLE</div>
          <div className={css.sideBarPeople}>
            {Object.keys(peopleSectionIcons).map(section => (
              <Button
                key={section}
                classes={{
                  root: css.button,
                  label: css.titleText
                }}
                onClick={(e: Event) => this.handleClick(e, section, section)}
                disabled={section === active}
              >
                <img
                  className={classNames({
                    [css.buttonIconImg]: true,
                    [css.active]: section === active,
                    [css.nonActive]: section !== active
                  })}
                  alt={section}
                  src={
                    active === section
                      ? peopleSectionIcons[section].active
                      : peopleSectionIcons[section].nonActive
                  }
                />
                <span
                  className={classNames({
                    [css.sectionText]: true,
                    [css.active]: section === active,
                    [css.nonActive]: section !== active
                  })}
                >
                  {section}
                </span>
              </Button>
            ))}
          </div>
        </div>
        <div className={css.categories}>
          <div className={css.sectionTitle}>
            PHYSICAL REQS <img src={AddNewIcon} alt="+" />
          </div>
          <div className={css.sideBarCategories}>
            {physical.map(category => (
              <Button
                key={category.id}
                onClick={(e: Event) =>
                  this.handleClick(e, category.type, category.id)
                }
                classes={{
                  root: css.categoryButton,
                  label: css.titleText
                }}
                disabled={category.id === active}
              >
                <span
                  className={classNames({
                    [css.categoryText]: true,
                    [css.active]: category.id === active,
                    [css.nonActive]: category.id !== active
                  })}
                >
                  {category.name.toLowerCase()}
                </span>
              </Button>
            ))}
          </div>
          <div className={css.sectionTitle}>
            DIGITAL REQS <img src={AddNewIcon} alt="+" />
          </div>
          <div className={css.sideBarCategories}>
            {digital.map(category => (
              <Button
                key={category.id}
                onClick={(e: Event) =>
                  this.handleClick(e, category.type, category.id)
                }
                classes={{
                  root: css.categoryButton,
                  label: css.titleText
                }}
                disabled={category.id === active}
              >
                <span
                  className={classNames({
                    [css.categoryText]: true,
                    [css.active]: category.id === active,
                    [css.nonActive]: category.id !== active
                  })}
                >
                  {category.name.toLowerCase()}
                </span>
              </Button>
            ))}
          </div>
        </div>
        <div className={css.sideBarFooter}>
          <img
            className={classNames({
              [css.footerIcon]: true
            })}
            alt="Reports"
            src={ReportsIcon}
          />
          <div className={css.footerText}>Reports</div>
        </div>
      </div>
    );
  }
}
