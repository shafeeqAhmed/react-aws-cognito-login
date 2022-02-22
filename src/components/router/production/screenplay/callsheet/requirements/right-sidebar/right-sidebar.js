// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import css from "./right-sidebar.style.css";
import imgNoteIcon from "static/images/noteIcon.svg";
import addBlueIcon from "static/images/plus-button-blue.svg";

type Props = {
  +bulletins: Array<Object>
};

export default class RightSidebar extends PureComponent<Props> {
  render() {
    const { bulletins } = this.props;

    return (
      <div className={css.rightSidebar}>
        <div className={css.title}>Today’s Bulletins</div>
        <ul className={css.bulletins}>
          {bulletins.map(b => (
            <li className={css.bulletin} key={b.id}>
              <div className={css.iconContainer}>
                <img
                  className={css.bulletinIcon}
                  src={imgNoteIcon}
                  alt="note"
                />
              </div>
              <div className={css.content}>
                <div className={css.bulletinText}>{b.content}</div>
                <div className={css.bulletinButtons}>
                  <button className={css.bulletinButton}>Edit</button>
                  <span className={css.dot}>·</span>
                  <button className={css.bulletinButton}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button className={css.addBulletinButton}>
          <img src={addBlueIcon} alt="+" className={css.addBulletinIcon} />
          <span className={css.addBulletinText}>Add Bulletin</span>
        </button>
      </div>
    );
  }
}
