// @flow
import React, { PureComponent } from "react";
import UserAvatar from "react-user-avatar";
import { ClipLoader } from "react-spinners";
import { browserHistory } from "react-router";
import AvatarEditor from "react-avatar-editor";
import { Field } from "redux-form";
import LinkReplace from "src/components/shared/LinkReplace/LinkReplace";
import TextField from "src/components/shared/TextField/TextField";
import DatePicker from "src/components/shared/DatePicker/DatePicker";
import PickerField from "src/components/shared/PickerField/PickerField";
import $ from "config/variables";
import css from "./Profile.style.css";
import type { ReduxProps } from "./";
import { displayName } from "src/redux/modules/users";

type Props = ReduxProps & {
  params: Object,
  handleSubmit: Function,
  pristine: boolean,
  productionId: number,
  history: Object,
  match: Object
};

type State = {
  colorField: string,
  labelColor: string,
  editAvatar: boolean,
  file: any,
  scale: number
};

class Profile extends PureComponent<Props, State> {
  state = {
    colorField: $.colorWhite,
    labelColor: $.colorWhiteFaded,
    editAvatar: false,
    file: "",
    scale: 1
  };

  editor: AvatarEditor = null;

  componentDidMount() {
    const {
      fetchUserRoles,
      fetchUserTags,
      match,
      fetchCurrentUser
    } = this.props;
    fetchCurrentUser();
    fetchUserRoles(match.params.productionId);
    fetchUserTags(match.params.productionId);
  }

  setEditorRef = (editor: AvatarEditor) => {
    this.editor = editor;
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.isSaving && !nextProps.isSaving) {
      this.setState({ editAvatar: false });
    }
  }

  handleCreditAs = () => {
    const { userName, creditName, changeFieldValue } = this.props;

    if (userName !== creditName) {
      return changeFieldValue("creditName", userName);
    }
    return changeFieldValue("creditName", "");
  };

  handleFileChange = (e: SyntheticInputEvent<>) => {
    e.preventDefault();
    this.setState({ file: e.target.files[0] });
  };

  handleScale = (e: SyntheticInputEvent<>) => {
    e.preventDefault();
    this.setState({ scale: parseFloat(e.target.value) });
  };

  handleEditAvatar = (e: SyntheticInputEvent<HTMLButtonElement>) => {
    this.setState({ editAvatar: !this.state.editAvatar });
  };

  handleSaveAvatar = () => {
    if (this.editor && this.state.file) {
      const canvas = this.editor.getImage();
      const imgUrl = canvas.toDataURL();
      canvas.toBlob(blob => {
        this.props.saveUserAvatar(blob, imgUrl);
      });
    }
  };

  props: Props;

  addTag = () => {
    const { productionId, userId } = this.props.params;
    return browserHistory.push(
      `/${productionId}/castcrew/profile/${userId}/tags`
    );
  };

  addTag: Function;

  handleCreditAs = () => {
    if (this.props.userName !== this.props.creditName) {
      return this.props.changeFieldValue("creditName", this.props.userName);
    }
    return this.props.changeFieldValue("creditName", "");
  };

  handleCreditAs: Function;

  goToVisibilitySettings = (title: string) => (
    <LinkReplace
      to={{
        pathname: this.props.location.pathname,
        query: { "visibility-settings": true },
        state: { title }
      }}
    >
      <i className={`material-icons ${css.visibilityIcon}`}>visibility</i>
    </LinkReplace>
  );

  goToVisibilitySettings: Function;

  renderAdditionalPhone = (props: any) => {
    const {
      fields,
      meta: { touched, error }
    } = props;

    return (
      <div className={css.width}>
        <ul>
          {fields.map((additional, index) => (
            <li key={additional}>
              <div className={css.fieldVisibilityAdd}>
                {this.goToVisibilitySettings(
                  `Additional Telephone (${index + 1})`
                )}
                <Field
                  type="text"
                  name={additional}
                  label={"Additional Telephone"}
                  placeholder={"Enter your Additional Telephone"}
                  placeholderLight
                  style={`${css.field}`}
                  conatinerStyle={css.fieldContainer}
                  component={TextField}
                />
                {index > 0 && (
                  <button
                    onClick={() => {
                      fields.remove(index);
                    }}
                  >
                    <i className={`material-icons ${css.addIcon}`}>close</i>
                  </button>
                )}
                {index === 0 && (
                  <button
                    onClick={() => {
                      fields.push(index);
                    }}
                  >
                    <i className={`material-icons ${css.addIcon}`}>add</i>
                  </button>
                )}
              </div>
              {touched && error && <span>{error}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  renderAdditionalAddress = (props: any) => {
    const {
      fields,
      meta: { touched, error }
    } = props;

    return (
      <div className={css.width}>
        <ul>
          {fields.map((additional, index) => (
            <li key={additional}>
              <div className={css.fieldVisibilityAdd}>
                {this.goToVisibilitySettings(
                  `Additional Address (${index + 1})`
                )}
                <Field
                  type="text"
                  name={additional}
                  label={"Additional Address"}
                  placeholder={"Enter your Additional Address"}
                  placeholderLight
                  style={`${css.field}`}
                  conatinerStyle={css.fieldContainer}
                  component={TextField}
                />
                {index > 0 && (
                  <button
                    onClick={() => {
                      fields.remove(index);
                    }}
                  >
                    <i className={`material-icons ${css.addIcon}`}>close</i>
                  </button>
                )}
                {index === 0 && (
                  <button
                    onClick={() => {
                      fields.push(index);
                    }}
                  >
                    <i className={`material-icons ${css.addIcon}`}>add</i>
                  </button>
                )}
              </div>
              {touched && error && <span>{error}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  renderAdditionalWebsite = (props: any) => {
    const {
      fields,
      meta: { touched, error }
    } = props;

    return (
      <div className={css.width}>
        <ul>
          {fields.map((additional, index) => (
            <li key={additional}>
              <div className={css.fieldVisibilityAdd}>
                {this.goToVisibilitySettings(
                  `Additional Website (${index + 1})`
                )}
                <Field
                  type="text"
                  name={additional}
                  label={"Additional Website"}
                  placeholder={"Enter your Additional Website"}
                  placeholderLight
                  style={`${css.field}`}
                  conatinerStyle={css.fieldContainer}
                  component={TextField}
                />
                {index > 0 && (
                  <button
                    onClick={() => {
                      fields.remove(index);
                    }}
                  >
                    <i className={`material-icons ${css.addIcon}`}>close</i>
                  </button>
                )}
                {index === 0 && (
                  <button
                    onClick={() => {
                      fields.push(index);
                    }}
                  >
                    <i className={`material-icons ${css.addIcon}`}>add</i>
                  </button>
                )}
              </div>
              {touched && error && <span>{error}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  render(): React$Element<any> {
    const {
      user,
      // params,
      isSaving,
      pristine,
      userName,
      userTags,
      userRoles,
      creditName,
      handleSubmit,
      history
    } = this.props;

    const roles = userRoles.map((role, index) => (
      <span key={role.name} className={css.role}>
        {role.name}
      </span>
    ));

    if (!user) return <div />;

    const tags =
      userTags &&
      userTags.items &&
      userTags.items.map((tag, index) => (
        <span key={tag.name} className={css.tag}>
          {tag.name}
        </span>
      ));

    const contentButton = isSaving ? (
      <div className={css.loading}>
        <ClipLoader color={$.colorWhite} />
      </div>
    ) : (
      <div>Save</div>
    );

    const avatarURL =
      user.avatar && user.avatar.urls[0] ? `url(${user.avatar.urls[0]})` : null;

    const avatar = avatarURL ? (
      <div className={css.avatar} style={{ backgroundImage: avatarURL }} />
    ) : (
      <UserAvatar
        borderRadius="75px"
        size="150"
        name={displayName(user)}
        style={{ color: "#FFF", margin: 15 }}
      />
    );

    const checkIcon =
      userName === creditName
        ? `${css.creditAsIcon}`
        : `${css.creditAsIcon} ${css.creditAsIconDisable}`;

    const fieldStyle = {
      color: $.colorWhite,
      labelColor: $.colorWhiteFaded,
      textTransform: "capitalize",
      fullWidth: true,
      underlineStyle: {
        borderColor: $.colorWhiteFaded
      },
      underlineFocusStyle: {
        borderColor: $.colorWhite
      }
    };

    return (
      <div className={css.container}>
        <div className={css.topBar}>
          <button
            onClick={() => {
              history.goBack();
            }}
          >
            <i className={`material-icons ${css.backIcon}`}>close</i>
          </button>
          <p className={css.username}>{user.firstName} Profile</p>
        </div>
        <div className={css.dataSection}>
          <div className={css.avatarContainer}>
            {!this.state.editAvatar ? (
              avatar
            ) : (
              <React.Fragment>
                <AvatarEditor
                  ref={this.setEditorRef}
                  image={this.state.file}
                  width={150}
                  height={150}
                  border={20}
                  scale={this.state.scale}
                  rotate={0}
                />
                <label htmlFor="avatar" className={css.customFileInput}>
                  <input
                    className={css.editAvatarInput}
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={this.handleFileChange}
                  />
                </label>
                <label htmlFor="scale" className={css.editAvatarLabels}>
                  Zoom
                </label>
                <input
                  name="scale"
                  type="range"
                  className={css.editAvatarInput}
                  onChange={this.handleScale}
                  min={"1"}
                  max="3"
                  step="0.01"
                  defaultValue="1"
                />
                <div className={css.buttonContainer}>
                  <button
                    disabled={isSaving}
                    className={`${css.submitBtn} ${css.submitAvatar}`}
                    onClick={this.handleSaveAvatar}
                  >
                    Save Avatar
                  </button>
                </div>
              </React.Fragment>
            )}
            {!this.state.editAvatar ? (
              <button
                className={css.editAvatarButton}
                onClick={this.handleEditAvatar}
              >
                <i className={`material-icons`}>edit</i>
              </button>
            ) : (
              <div className={css.buttonContainer}>
                <button
                  disabled={isSaving}
                  className={css.cancelBtn}
                  onClick={this.handleEditAvatar}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className={`${css.addInputSection} ${css.width}`}>
            <Field
              type="text"
              name={"name"}
              label={"Legal Name"}
              placeholder={"Enter your Legal Name"}
              placeholderLight
              style={css.field}
              conatinerStyle={css.fieldContainer}
              component={TextField}
              {...fieldStyle}
            />
            <button className={css.creditAs} onClick={this.handleCreditAs}>
              <i className={`material-icons ${checkIcon}`}>check</i>
              <div className={css.creditAsText}>Credit As</div>
            </button>
          </div>
          {userName !== creditName && (
            <div className={`${css.fieldDiv} ${css.width}`}>
              <Field
                type="text"
                name={"creditName"}
                label={"Name for Credits"}
                placeholder={"Enter your Name of Credits"}
                placeholderLight
                style={css.field}
                conatinerStyle={css.fieldContainer}
                component={TextField}
                {...fieldStyle}
              />
            </div>
          )}
          <div className={css.width}>
            <p className={css.positionText}>Position</p>
            <div className={`${css.roles}`}>
              <div className={`${css.rolesScroll}`}>
                {userRoles.length === 0 && (
                  <span className={css.noRoles}>There are no roles</span>
                )}
                {roles}
              </div>
              {/* <button onClick={this.goToChat}>
                                <i className={`material-icons ${css.addIcon}`}>add</i>
                            </button> */}
            </div>
          </div>
          <div className={`${css.fieldDiv} ${css.width}`}>
            <span className={css.initKey}>@</span>
            <Field
              type="text"
              name={"mention"}
              label={"@name"}
              placeholder={"Enter your @name"}
              placeholderLight
              style={`${css.field}`}
              conatinerStyle={css.fieldContainer}
              component={TextField}
              {...fieldStyle}
            />
          </div>
          <div className={`${css.fieldDiv} ${css.width}`}>
            <Field
              type="text"
              name={"email"}
              label={"Email"}
              placeholder={"Enter your Email"}
              placeholderLight
              style={`${css.field}`}
              conatinerStyle={css.fieldContainer}
              component={TextField}
              {...fieldStyle}
            />
          </div>
        </div>
        <div className={css.titleBar}>
          <div className={`${css.titleBarText} ${css.width}`}>
            PRODUCTION TAGS
          </div>
        </div>
        <div className={css.dataSection}>
          <div className={`${css.width} ${css.roles}`}>
            <div className={`${css.rolesScroll}`}>
              {tags || <span className={css.noRoles}>There are no tags</span>}
            </div>
            <button onClick={this.addTag}>
              <i className={`material-icons ${css.addIcon}`}>add</i>
            </button>
          </div>
        </div>
        <div className={css.titleBar}>
          <div className={`${css.titleBarText} ${css.width}`}>
            CONTACT DETAILS
          </div>
        </div>
        <div className={css.dataSection}>
          <div className={`${css.fieldVisibility} ${css.width}`}>
            {this.goToVisibilitySettings("Primary Telephone")}
            <Field
              type="text"
              name={"primaryTelephone"}
              label={"Primary Telephone"}
              placeholder={"Enter your Primary Telephone"}
              placeholderLight
              style={`${css.field}`}
              conatinerStyle={css.fieldContainer}
              component={TextField}
              {...fieldStyle}
            />
          </div>
          {/* <FieldArray
                        name="additionalTelephone"
                        component={this.renderAdditionalPhone}
                    /> */}
          <div className={`${css.fieldVisibility} ${css.width}`}>
            {this.goToVisibilitySettings("Primary Address")}
            <Field
              type="text"
              name={"primaryAddress"}
              label={"Primary Address"}
              placeholder={"Enter your Primary Address"}
              placeholderLight
              style={`${css.field}`}
              conatinerStyle={css.fieldContainer}
              component={TextField}
              {...fieldStyle}
            />
          </div>
          {/* <FieldArray
                        name="additionalAddress"
                        component={this.renderAdditionalAddress}
                    /> */}
          <div className={`${css.fieldDiv} ${css.width}`}>
            <Field
              type="text"
              name={"twitter"}
              label={"Twitter"}
              placeholder={"Enter your Twitter"}
              placeholderLight
              style={`${css.field}`}
              conatinerStyle={css.fieldContainer}
              component={TextField}
              {...fieldStyle}
            />
          </div>
          <div className={`${css.fieldVisibility} ${css.width}`}>
            {this.goToVisibilitySettings("Primary Website")}
            <Field
              type="text"
              name={"website"}
              label={"Website"}
              placeholder={"Enter your Website"}
              placeholderLight
              style={`${css.field}`}
              conatinerStyle={css.fieldContainer}
              component={TextField}
              {...fieldStyle}
            />
          </div>
          {/* <FieldArray
                        name="additionalWebsite"
                        component={this.renderAdditionalWebsite}
                    /> */}
          <div className={`${css.fieldDiv} ${css.width}`}>
            <Field
              type="text"
              name={"imdb"}
              label={"IMDB"}
              placeholder={"Enter your IMDB"}
              placeholderLight
              style={`${css.field}`}
              conatinerStyle={css.fieldContainer}
              component={TextField}
              {...fieldStyle}
            />
          </div>
        </div>
        <div className={css.titleBar}>
          <div className={`${css.titleBarText} ${css.width}`}>
            UNION/CASTING DATA
          </div>
        </div>
        <div className={css.dataSection}>
          <div className={`${css.fieldDiv} ${css.width}`}>
            <Field
              name={"dob"}
              label={"Date of Birth"}
              placeholder={"Select your Date of Birth"}
              style={`${css.field}`}
              conatinerStyle={css.fieldContainer}
              component={DatePicker}
              {...fieldStyle}
            />
          </div>
          <div className={`${css.fieldDiv} ${css.width}`}>
            <Field
              name={"gender"}
              label={"Gender"}
              placeholder={"Select your Gender"}
              style={`${css.field}`}
              conatinerStyle={css.fieldContainer}
              component={PickerField}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </Field>
          </div>
          <div className={`${css.fieldDiv} ${css.width}`}>
            <Field
              name={"ethnicity"}
              label={"Ethnicity"}
              placeholder={"Select your Gender"}
              style={`${css.field}`}
              conatinerStyle={css.fieldContainer}
              component={PickerField}
            >
              <option value="White/Caucasian">White/Caucasian</option>
              <option value="African">African</option>
            </Field>
          </div>
        </div>
        <div className={css.titleBar}>
          <div className={`${css.titleBarText} ${css.width}`}>
            ADDITIONAL INFORMATION
          </div>
        </div>
        <div className={css.dataSection}>
          <div className={`${css.fieldDiv} ${css.width}`}>
            <Field
              type="textarea"
              name={"information"}
              label={"Notes"}
              placeholder={"Enter your Notes"}
              placeholderLight
              style={`${css.field}`}
              conatinerStyle={css.fieldContainer}
              component={TextField}
              {...fieldStyle}
            />
          </div>
          {!pristine && (
            <button
              disabled={isSaving}
              className={`${css.submitBtn} ${css.width}`}
              onClick={handleSubmit}
            >
              {contentButton}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Profile;
