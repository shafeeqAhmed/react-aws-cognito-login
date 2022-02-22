// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Fragment, PureComponent } from "react";
import { Field } from "redux-form";
import TextField from "src/components/shared/TextField";
import Layout from "src/components/layouts/onboarding";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AvatarEditor from "react-avatar-editor";
import rightBackground from "static/images/signupBackground.png";
// import emptyProfile from "static/images/empty-profile.svg";
import facebookIcon from "static/images/facebookIcon.svg";
import closeIcon from "static/images/closeOnboardingButton.svg";
import FacebookProvider, { Login } from "react-facebook";
import { GoogleLogin } from "react-google-login";
import googleIcon from "static/images/googleIcon.svg";
import css from "./signup.style.css";
import type { ReduxProps } from "./";

type Props = ReduxProps;

type State = {
  editAvatar: boolean,
  file: any,
  scale: number,
  showConfirmDialog: boolean
};

/* eslint-disable */
type GoogleProfile = {
  +profileObj: {
    +email: string,
    +familyName: string,
    +givenName: string,
    +imageUrl: string
  }
};
/* eslint-enable */

class SignUp extends PureComponent<Props, State> {
  state = {
    editAvatar: false,
    file: "",
    scale: 1,
    showConfirmDialog: false
  };

  editor: AvatarEditor = null;

  setEditorRef = (editor: AvatarEditor) => {
    this.editor = editor;
  };

  handleFileChange = (e: SyntheticInputEvent<>) => {
    e.preventDefault();

    // eslint-disable-next-line react/prop-types
    const { change } = this.props;
    const file = e.target.files[0];

    change("file", file);
    this.setState({ file });
  };

  handleScale = (e: SyntheticInputEvent<>) => {
    e.preventDefault();
    this.setState({ scale: parseFloat(e.target.value) });
  };

  handleEditAvatar = (e: SyntheticInputEvent<HTMLButtonElement>) => {
    this.setState({ editAvatar: !this.state.editAvatar });
  };

  onSuccessGoogle = ({ profileObj }: GoogleProfile) => {
    // eslint-disable-next-line standard/object-curly-even-spacing
    const { change /* , getSignUpAvatar */ } = this.props;
    const { givenName, familyName, email, imageUrl } = profileObj;

    change("firstName", givenName);
    change("lastName", familyName);
    change("email", email);

    if (imageUrl) {
      this.setState({
        file: imageUrl
      });

      // getSignUpAvatar({ provider: "google", url: imageUrl });
    }
  };

  onFailureGoogle = (response: any) => {
    // console.log(response);
  };

  onSuccessFacebook = (response: any) => {
    // eslint-disable-next-line standard/object-curly-even-spacing
    const { change /* , getSignUpAvatar */ } = this.props;

    if (!response.tokenDetail) return;
    /* eslint-disable-next-line camelcase */
    const { email, first_name, last_name, picture } = response.profile;

    change("firstName", first_name);
    change("lastName", last_name);
    change("email", email);

    if (picture) {
      this.setState({
        file: picture.data.url
      });
      // getSignUpAvatar({
      //   provider: "facebook",
      //   userId: response.tokenDetail.userID
      // });
    }
  };

  onFailureFacebook = (response: any) => {
    // console.log(response);
  };

  componentWillReceiveProps = (nextProps: Props) => {
    /* eslint-disable-next-line react/prop-types */
    if (this.props.signUpAvatar !== nextProps.signUpAvatar) {
      if (nextProps.signUpAvatar) {
        this.setState({
          file: nextProps.signUpAvatar
        });
      }
    }
  };

  closeDialog = () => {
    this.setState({
      showConfirmDialog: false
    });
  };

  openDialog = () => {
    this.setState({
      showConfirmDialog: true
    });
  };

  handleSaveAvatar = async () => {
    if (this.editor && this.state.file) {
      const canvas = this.editor.getImage();
      const imgUrl = canvas.toDataURL();

      canvas.toBlob(blob => {
        this.props.change("avatar", { blob, imgUrl });
        this.setState({
          file: imgUrl,
          editAvatar: false,
          scale: 1
        });
      });
    }
  };

  renderSocialSignup() {
    return (
      <Fragment>
        <div className={css.orText}>OR</div>
        <div className={css.socialContainer}>
          <div className={css.socialIcon}>
            <FacebookProvider appId="2228591597428024">
              <Login
                scope="email"
                fields="first_name,last_name,email,picture"
                onResponse={this.onSuccessFacebook}
                onError={this.onFailureFacebook}
              >
                <img src={facebookIcon} alt="Facebook" />
              </Login>
            </FacebookProvider>
          </div>
          <div className={css.socialIcon}>
            <GoogleLogin
              clientId="381444487591-p5rmmgj53n2jv2qvfbl4udugbkjnah48.apps.googleusercontent.com"
              onSuccess={this.onSuccessGoogle}
              onFailure={this.onFailureGoogle}
              render={renderProps => (
                <button onClick={renderProps.onClick}>
                  <img src={googleIcon} alt="Google" />
                </button>
              )}
            />
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    /* eslint-disable react/prop-types */
    const {
      messageError,
      valid,
      pristine,
      handleSubmit,
      isFetching,
      email
    } = this.props;
    /* eslint-enable react/prop-types */

    // const avatar = (
    //   <button onClick={this.handleEditAvatar}>
    //     <img
    //       src={this.state.file || emptyProfile}
    //       alt="Avatar"
    //       style={{ width: 70, height: 70, borderRadius: 30 }}
    //     />
    //   </button>
    // );

    const labelStyle = {
      fontSize: 20,
      color: "#848484",
      top: 28
    };

    const inputStyle = {
      fontWeight: 500,
      height: 80,
      paddingBottom: 30,
      fontSize: 20
    };

    const errorStyle = {
      right: 0,
      bottom: 27,
      fontSize: 16
    };

    return (
      <Layout title={"Create Account"} background={rightBackground}>
        <div className={css.content}>
          {/* <div className={css.editAvatarContainer}>
            {!this.state.editAvatar ? (
              avatar
            ) : (
              <div className={css.avatarContainer}>
                <AvatarEditor
                  ref={this.setEditorRef}
                  image={this.state.file}
                  width={70}
                  height={70}
                  border={10}
                  scale={this.state.scale}
                  className={css.avatarButton}
                  rotate={0}
                  borderRadius={30}
                  style={{
                    borderRadius: 30
                  }}
                />
                <div className={css.editControls}>
                  <label htmlFor="avatar" className={css.customFileInput}>
                    <input
                      className={css.editAvatarInput}
                      name="avatar"
                      type="file"
                      accept="image/*"
                      onChange={e => this.handleFileChange(e)}
                    />
                  </label>
                  <label htmlFor="scale" className={css.editAvatarLabel}>
                    Zoom
                  </label>
                  <input
                    name="scale"
                    type="range"
                    className={css.inputRange}
                    onChange={this.handleScale}
                    min={"1"}
                    max="3"
                    step="0.01"
                    defaultValue="1"
                  />
                  <div className={css.buttonsContainer}>
                    <button
                      className={css.cancelBtn}
                      onClick={this.handleEditAvatar}
                    >
                      Cancel
                    </button>
                    <button
                      className={css.submitBtn}
                      onClick={this.handleSaveAvatar}
                    >
                      Save Avatar
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!this.state.editAvatar && (
              <div
                className={`${css.editAvatarText} ${
                  this.state.file ? css.editAvatarTextEdit : ""
                }`}
              >
                {!this.state.file ? "Profile Photo" : "Edit"}
              </div>
            )}
          </div> */}
          <div className={css.fieldsContainer}>
            <div className={css.fieldContainer}>
              <Field
                id="email"
                name="email"
                label="Your Email"
                component={TextField}
                type="email"
                style={inputStyle}
                labelStyle={labelStyle}
                errorStyle={errorStyle}
                fullWidth
              />
            </div>
            <div className={css.fieldContainer}>
              <Field
                id="firstName"
                name="firstName"
                label="First Name"
                component={TextField}
                type="text"
                style={inputStyle}
                labelStyle={labelStyle}
                errorStyle={errorStyle}
                fullWidth
              />
            </div>
            <div className={css.fieldContainer}>
              <Field
                id="lastName"
                name="lastName"
                label="Last Name"
                component={TextField}
                type="text"
                style={inputStyle}
                classes={{
                  root: css.root
                }}
                labelStyle={labelStyle}
                errorStyle={errorStyle}
                fullWidth
              />
            </div>
            <div className={css.helpText}>
              Don’t worry about a password yet. We will email you a link to
              create one.
            </div>
          </div>
          {/* this.renderSocialSignup() */}
          <div className={css.messageError}>{messageError || null}</div>
          <Button
            disableRipple
            disabled={!valid || pristine}
            classes={{
              root: css.nextButton,
              disabled: css.nextButtonDisabled
            }}
            onClick={this.openDialog}
          >
            {!isFetching ? "Next" : "Sending..."}
          </Button>
          <div className={css.pagination}>
            <div className={css.step} />
            <div className={css.step} />
            <div className={`${css.step} ${css.stepActive}`} />
            <div className={css.step} />
          </div>
          <Dialog
            aria-labelledby="simple-dialog-title"
            open={this.state.showConfirmDialog}
            classes={{
              paper: css.dialog
            }}
          >
            <div className={css.dialogContainer}>
              <div className={css.dialogEmail}>{email}</div>
              <div className={css.dialogQuestion}>
                Is this your correct email address?
              </div>
              <div className={css.dialogButtonsContainer}>
                <Button
                  disableRipple
                  classes={{
                    root: css.editButton
                  }}
                  onClick={this.closeDialog}
                >
                  EDIT
                </Button>
                <Button
                  disableRipple
                  classes={{
                    root: css.confirmButton
                  }}
                  onClick={handleSubmit}
                >
                  YES
                </Button>
              </div>
              <button className={css.closeButton} onClick={this.closeDialog}>
                <img src={closeIcon} alt="Close" />
              </button>
            </div>
          </Dialog>
        </div>
      </Layout>
    );
  }
}

export default SignUp;
