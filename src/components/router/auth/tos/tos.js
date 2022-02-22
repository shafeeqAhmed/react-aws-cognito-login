// @flow
import React, { Component } from "react";
import procliqLogo from "static/images/procliqLogo.svg";
import closeIcon from "static/images/closeOnboardingButtonBlue.svg";
import tosText from "./text";
import css from "./tos.style.css";
import type { Props } from "./";

type State = {};

export default class Tos extends Component<Props, State> {
  handleAgree = () => {
    const { acceptTOS, jwt, registerUser, registrationData } = this.props;
    if (registrationData) {
      registerUser({ ...registrationData, tosAccepted: true });
    } else {
      acceptTOS(jwt);
    }

    this.props.history.replace("/check-email");
  };

  render() {
    return (
      <div className={css.main}>
        <img src={procliqLogo} alt="ProCliq" className={css.logo} />
        <button
          className={css.closeButton}
          onClick={() => this.props.history.goBack()}
        >
          <img src={closeIcon} alt="Close" />
        </button>
        <h1 className={css.title}>Please review our Customer Agreement</h1>

        <div className={css.tosText}>{tosText}</div>

        <div className={css.footer}>
          <div className={css.footerText}>
            By choosing I Agree, you understand and agree to the Customer
            Agreement and our <span>Privacy Policy</span> and referenced
            Agreements.
          </div>
          <button className={css.footerButton} onClick={this.handleAgree}>
            I Agree
          </button>
        </div>
      </div>
    );
  }
}
