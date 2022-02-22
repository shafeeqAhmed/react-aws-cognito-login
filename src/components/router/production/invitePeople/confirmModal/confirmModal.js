// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { get, map, pick } from "lodash";
import UserAvatar from "react-user-avatar";
import Button from "@material-ui/core/Button";
import closeIcon from "static/images/closeOnboardingButton.svg";
import css from "./confirmModal.style.css";
import type { Contact, ContactsList } from "src/redux/modules/users";
import type { ReduxProps } from "./";

type Props = ReduxProps & {
  onClose: Function,
  +selectedContacts: ContactsList
};

export default class InvitePeople extends PureComponent<Props> {
  sendInvitations = () => {
    const { sendInvitations, selectedContacts, match, history } = this.props;
    const contacts = map(selectedContacts, item =>
      pick(item, ["email", "firstName", "lastName"])
    );
    const productionId = match.params.productionId;

    sendInvitations(productionId, contacts).then(() => {
      history.push(`/${productionId}/drive`);
    });
  };

  renderContactAvatar = (contact: Contact) => {
    const avatar = get(contact, "avatar.urls", null);
    const avatarURL = avatar ? `url(${avatar[0]})` : null;
    return avatarURL ? (
      <div
        className={css.avatar}
        style={{
          backgroundImage: avatarURL
        }}
      />
    ) : (
      <UserAvatar
        borderRadius={"30px"}
        size={"80"}
        name={contact.firstName + contact.lastName || contact.email}
        style={{ color: "#FFF" }}
      />
    );
  };

  renderSelectedContacts = (): any => {
    const { selectedContacts } = this.props;

    return Object.keys(selectedContacts).map(contactId => {
      const contact = selectedContacts[contactId];

      return (
        <div key={contactId} className={css.selectedContact}>
          {this.renderContactAvatar(contact)}
          <div className={css.contactInfo}>
            <div className={css.selectedContactName}>
              {contact.firstName} {contact.lastName}
            </div>
            <div className={css.selectedContactEmail}>{contact.email}</div>
          </div>
        </div>
      );
    });
  };

  render() {
    const { selectedContacts, onClose, error } = this.props;

    return (
      <div className={css.main}>
        <div className={css.content}>
          <h1 className={css.confirmTitle}>Confirm Invites</h1>
          <div className={css.productionTitle}>
            <h1>Dogs of War</h1>
            <h3>(Bleutuna Limited)</h3>
            <div className={css.queue}>
              {Object.keys(selectedContacts).length} invite queued
            </div>
          </div>
          <div className={css.listContainer}>
            {this.renderSelectedContacts()}
          </div>
          <div className={css.inviteButtonContainer}>
            <Button
              classes={{
                root: css.inviteButton,
                label: css.inviteLabel
              }}
              onClick={this.sendInvitations}
            >
              CONFIRM
            </Button>
            {error && (
              <div className={css.errorMessage}>
                An error has ocurred, try again.
              </div>
            )}
          </div>
        </div>
        <button className={css.closeButton} onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
      </div>
    );
  }
}
