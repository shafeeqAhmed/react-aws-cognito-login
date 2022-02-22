// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from "react";
import { get } from "lodash";
import rightBackground from "static/images/invitationsBackground.png";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/CheckCircle";
import { InvitationStatuses } from "src/redux/modules/productions";
import Layout from "src/components/layouts/onboarding";
import css from "./invitations.style.css";
import type { ReduxProps } from "./";

type Props = ReduxProps & {};

type State = {};

export default class SetUpPassword extends Component<Props, State> {
  state = {};

  componentDidMount = async () => {
    const { getInvitations } = this.props;
    await getInvitations();
  };

  handleAcceptInvitation = (code: string) => {
    const { acceptInvitation } = this.props;
    acceptInvitation(code);
  };

  render() {
    const { invitations, history } = this.props;
    if (!invitations.length) history.push("/new-team/name");

    return (
      <Layout title="Join Production" background={rightBackground}>
        <div className={css.invitationsContent}>
          <div className={css.invitationsContainer}>
            {!!invitations.length &&
              invitations.map(invitation => (
                <div key={invitation.id} className={css.invitation}>
                  <img
                    src={
                      invitation.production.poster &&
                      invitation.production.poster.urls[0]
                    }
                    alt={invitation.production.name}
                    className={css.invitationPoster}
                  />
                  <div className={css.invitationContent}>
                    <div className={css.sender}>
                      <span>{`${invitation.user.firstName} ${
                        invitation.user.lastName
                      }`}</span>{" "}
                      invited you to join.
                    </div>
                    <div className={css.title}>
                      <h3>{invitation.production.name}</h3>
                    </div>
                    {get(invitation, "production.team.name") ? (
                      <div className={css.company}>
                        {get(invitation, "production.team.name")}
                      </div>
                    ) : null}
                    {!invitation.status === InvitationStatuses.ACCEPTED ? (
                      <Button
                        disableRipple
                        classes={{
                          root: css.joinButton,
                          label: css.joinButtonLabel
                        }}
                        onClick={() =>
                          this.handleAcceptInvitation(invitation.code)
                        }
                      >
                        JOIN PRODUCTION
                      </Button>
                    ) : (
                      <div className={css.accepted}>
                        <CheckIcon classes={{ root: css.acceptedIcon }} />
                        Accepted
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <Button
            disableRipple
            classes={{
              root: css.newProductionButton
            }}
            onClick={() => history.push("/new-team/name")}
          >
            CREATE NEW PRODUCTION
          </Button>
        </div>
      </Layout>
    );
  }
}
