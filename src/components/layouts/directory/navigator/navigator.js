// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
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
import classNames from "classnames";
import { Sections } from "src/redux/modules/directory";
import css from "./navigator.style.css";
import type { Section } from "src/redux/modules/directory";

import type { Props } from "./";

type State = {
  activeSection: string
};

const sectionIcons = {
  CAST: {
    active: CastActiveIcon,
    nonActive: CastIcon
  },
  CREW: {
    active: CrewActiveIcon,
    nonActive: CrewIcon
  },
  EXTRAS: {
    active: ExtrasActiveIcon,
    nonActive: ExtrasIcon
  },
  NETWORK: {
    active: NetworkActiveIcon,
    nonActive: NetworkIcon
  }
};

const categories = [
  "Location",
  "Set Dressing",
  "Props",
  "Makeup",
  "Special FX",
  "Vehicles",
  "Stunts",
  "Wardrobe",
  "Equipment"
];

export default class Navigator extends PureComponent<Props, State> {
  state = {
    activeSection: ""
  };

  componentWillMount = () => {
    const {
      location: { pathname }
    } = this.props;
    this.setActiveSection(pathname);
  };

  componentWillReceiveProps = (nextProps: Props) => {
    const {
      location: { pathname }
    } = this.props;
    const {
      location: { pathname: nextPathname }
    } = nextProps;

    if (pathname !== nextPathname) this.setActiveSection(nextPathname);
  };

  setActiveSection = (pathname: string) => {
    const path = pathname.split("/");

    this.setState({
      activeSection: path[path.length - 1]
    });
  };

  handleClick = (e: Event, section: Section) => {
    e.preventDefault();
    if (section === this.state.activeSection) return false;

    const {
      history,
      match: {
        params: { productionId }
      }
    } = this.props;

    history.push(`/${productionId}/directory/${section}`);
    return false;
  };

  render() {
    const { activeSection } = this.state;

    return (
      <div className={css.navigator}>
        <div className={css.people}>
          <div className={css.sectionTitle}>PEOPLE</div>
          <div className={css.sideBarPeople}>
            {Object.keys(Sections).map(section => (
              <Button
                key={section}
                classes={{
                  root: css.button,
                  label: css.titleText
                }}
                onClick={(e: Event) => this.handleClick(e, Sections[section])}
              >
                <img
                  className={classNames({
                    [css.buttonIconImg]: true,
                    [css.active]: Sections[section] === activeSection,
                    [css.nonActive]: Sections[section] !== activeSection
                  })}
                  alt={Sections[section]}
                  src={
                    activeSection === Sections[section]
                      ? sectionIcons[section].active
                      : sectionIcons[section].nonActive
                  }
                />
                <span
                  className={classNames({
                    [css.sectionText]: true,
                    [css.active]: Sections[section] === activeSection,
                    [css.nonActive]: Sections[section] !== activeSection
                  })}
                >
                  {Sections[section]}
                </span>
              </Button>
            ))}
          </div>
        </div>
        <div className={css.categories}>
          <div className={css.sectionTitle}>
            CATEGORIES <img src={AddNewIcon} alt="+" />
          </div>
          <div className={css.sideBarCategories}>
            {categories.map(category => (
              <Button
                key={category}
                classes={{
                  root: css.categoryButton,
                  label: css.titleText
                }}
              >
                <span
                  className={classNames({
                    [css.categoryText]: true
                  })}
                >
                  {category}
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
