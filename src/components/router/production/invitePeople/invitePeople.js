// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { get, intersection, pick } from "lodash";
import { Field } from "redux-form";
import UserAvatar from "react-user-avatar";
import TextField from "src/components/shared/TextField";
import facebookIcon from "static/images/facebookIcon.svg";
import googleIcon from "static/images/googleIcon.svg";
import procliqLogo from "static/images/procliqLogo.svg";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import ConfirmModal from "./confirmModal";
import css from "./invitePeople.style.css";
import type { Contact } from "src/redux/modules/users";
import type { ReduxProps } from "./";

type Props = ReduxProps & {};

type State = {
  selectedContacts: Array<string>,
  showConfirmModal: boolean
};

export default class InvitePeople extends PureComponent<Props, State> {
  state = {
    selectedContacts: [],
    showConfirmModal: false
  };

  componentDidMount = () => {
    this.props.getContacts();
  };

  renderContactAvatar = (contact: Contact, large?: boolean) => {
    const avatar = get(contact, "avatar.urls", null);
    const avatarURL = avatar ? `url(${avatar[0]})` : null;
    return avatarURL ? (
      <div
        className={`${css.avatar} ${large ? css.avatarLarge : ""}`}
        style={{
          backgroundImage: avatarURL
        }}
      />
    ) : (
      <UserAvatar
        borderRadius={large ? "30px" : "16px"}
        size={large ? "80" : "40"}
        name={contact.firstName + contact.lastName || contact.email}
        style={{ color: "#FFF" }}
      />
    );
  };

  selectContact = (contactId: string) => {
    const selectedContacts = [...this.state.selectedContacts];

    const index = selectedContacts.findIndex(item => item === contactId);

    if (index !== -1) {
      selectedContacts.splice(index, 1);
    } else {
      selectedContacts.push(contactId);
    }

    this.setState({
      selectedContacts
    });
  };

  openConfirmModal = () => {
    this.setState({
      showConfirmModal: true
    });
  };

  closeConfirmModal = () => {
    this.setState({
      showConfirmModal: false
    });
  };

  renderContacts = (): any => {
    const { contacts } = this.props;
    const { selectedContacts } = this.state;

    return Object.keys(contacts).map(contactId => {
      const contact = contacts[contactId];
      const selected = selectedContacts.includes(contactId);

      return (
        <button
          className={css.contact}
          key={contactId}
          onClick={() => this.selectContact(contactId)}
        >
          <div
            className={`${css.selectContact} ${selected ? css.selected : ""}`}
          />
          {this.renderContactAvatar(contact)}
          <div className={css.contactInfo}>
            <div className={css.contactName}>
              {contact.firstName} {contact.lastName}
            </div>
            <div className={css.contactEmail}>{contact.email}</div>
          </div>
        </button>
      );
    });
  };

  renderSelectedContacts = () => {
    const { selectedContacts } = this.state;
    const { contacts } = this.props;

    return intersection(Object.keys(contacts), selectedContacts).map(
      contactId => {
        const contact = contacts[contactId];

        return (
          <div key={contactId} className={css.selectedContact}>
            {this.renderContactAvatar(contact, true)}
            <div className={css.contactInfo}>
              <div className={css.selectedContactName}>
                {contact.firstName} {contact.lastName}
              </div>
              <div className={css.selectedContactEmail}>{contact.email}</div>
            </div>
          </div>
        );
      }
    );
  };

  render() {
    const { selectedContacts, showConfirmModal } = this.state;
    const { contacts } = this.props;

    return (
      <div className={css.main}>
        <div className={css.leftColumn}>
          <img src={procliqLogo} alt="ProCliq" className={css.logo} />
          <div className={css.content}>
            <h1>Invite Cast or Crew</h1>
            <div className={css.socialContainer}>
              <div className={css.socialIcon}>
                <img src={facebookIcon} alt="Facebook" />
              </div>
              <div className={css.socialIcon}>
                <img src={googleIcon} alt="Google" />
              </div>
            </div>
            <div className={css.orText}>OR</div>
            <div className={css.fieldContainer}>
              <SearchIcon className={css.searchIcon} />
              <Field
                id="filter"
                name="filter"
                placeholder="Search for name or email address…"
                component={TextField}
                style={{
                  paddingLeft: "30px"
                }}
                type="text"
                fullWidth
              />
            </div>
            <div className={css.listContainer}>
              <div className={css.header}>A</div>
              <div className={css.list}>{this.renderContacts()}</div>
            </div>
          </div>
        </div>
        <div className={css.rightColumn}>
          <div className={css.title}>
            <h1>Dogs of War</h1>
            <h3>(Bleutuna Limited)</h3>
            <div className={css.queue}>
              {selectedContacts.length} invite queued
            </div>
          </div>
          <div className={css.selectedContacts}>
            {selectedContacts.length ? (
              this.renderSelectedContacts()
            ) : (
              <div className={css.noUsersSelected}>
                No users selected.<br />Please choose from your contacts.
              </div>
            )}
          </div>
          <div className={css.inviteButtonContainer}>
            <Button
              classes={{
                root: css.inviteButton,
                label: css.inviteLabel
              }}
              onClick={this.openConfirmModal}
            >
              INVITE
            </Button>
          </div>
        </div>
        {showConfirmModal && (
          <ConfirmModal
            selectedContacts={pick(contacts, selectedContacts)}
            onClose={this.closeConfirmModal}
          />
        )}
      </div>
    );
  }
}
