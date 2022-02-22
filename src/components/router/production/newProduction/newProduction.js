// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from "react";
import { Field } from "redux-form";
import TextField from "src/components/shared/TextField";
import Layout from "src/components/layouts/onboarding";
import Button from "@material-ui/core/Button";
import AvatarEditor from "react-avatar-editor";
import MenuItem from "material-ui/MenuItem";
import SelectField from "src/components/shared/SelectField";
import rightBackground from "static/images/newProductionBackground.png";
import posterPlaceholder from "static/images/poster-placeholder.svg";
import css from "./newProduction.style.css";
import { type Props } from "./";

type State = {
  editPoster: boolean,
  file: any,
  scale: number
};

export default class NewProduction extends PureComponent<Props, State> {
  state = {
    editPoster: false,
    file: "",
    scale: 1
  };

  editor: AvatarEditor = null;

  setEditorRef = (editor: AvatarEditor) => {
    this.editor = editor;
  };

  handleFileChange = (e: SyntheticInputEvent<>) => {
    e.preventDefault();
    this.setState({ file: e.target.files[0] });
  };

  handleScale = (e: SyntheticInputEvent<>) => {
    e.preventDefault();
    this.setState({ scale: parseFloat(e.target.value) });
  };

  handleEditPoster = (e: SyntheticInputEvent<HTMLButtonElement>) => {
    this.setState({ editPoster: !this.state.editPoster });
  };

  handleSavePoster = (e: Event) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (this.editor && this.state.file) {
      const canvas = this.editor.getImage();
      const imgUrl = canvas.toDataURL();
      canvas.toBlob(blob => {
        // this.props.saveProductionPoster(blob, imgUrl);
        this.props.change("poster", { blob, imgUrl });
        this.setState({
          file: imgUrl,
          editPoster: false,
          scale: 1
        });
      });
    }
  };

  componentDidMount = () => {
    const { getProductionTypes } = this.props;
    getProductionTypes();
  };

  showProductionsTypes = () => {
    const { types } = this.props;

    return (
      types &&
      types.map(item => (
        <MenuItem key={item.id} value={item.id} primaryText={item.name} />
      ))
    );
  };

  render() {
    const {
      messageError,
      valid,
      pristine,
      handleSubmit,
      submitting,
      asyncValidating
    } = this.props;

    const { file, editPoster } = this.state;

    const poster = (
      <button onClick={this.handleEditPoster}>
        <img
          src={this.state.file || posterPlaceholder}
          alt="Poster"
          style={{ width: 81, height: 120 }}
        />
      </button>
    );

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
      <Layout title={"Create a \nNew Production"} background={rightBackground}>
        <form
          id="newProductionForm"
          onSubmit={handleSubmit}
          className={css.content}
        >
          <div className={css.editPosterContainer}>
            {!this.state.editPoster ? (
              poster
            ) : (
              <div className={css.posterContainer}>
                <AvatarEditor
                  ref={this.setEditorRef}
                  image={this.state.file}
                  width={71}
                  height={110}
                  border={10}
                  scale={this.state.scale}
                  rotate={0}
                />
                <div className={css.editControls}>
                  <label htmlFor="poster" className={css.customFileInput}>
                    <input
                      className={css.editPosterInput}
                      name="poster"
                      type="file"
                      accept="image/*"
                      onChange={this.handleFileChange}
                    />
                  </label>
                  <label htmlFor="scale" className={css.editPosterLabel}>
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
                      // disabled={isSaving}
                      className={css.cancelBtn}
                      onClick={this.handleEditPoster}
                    >
                      Cancel
                    </button>
                    <button
                      // disabled={isSaving}
                      className={css.submitBtn}
                      onClick={this.handleSavePoster}
                    >
                      Save Poster
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!this.state.editPoster && (
              <div className={css.editPosterText}>
                {!this.state.file ? "Poster Art" : "Edit"}
              </div>
            )}
          </div>
          <div className={css.fieldContainer}>
            <Field
              id="name"
              name="name"
              label="Production Name"
              component={TextField}
              type="text"
              fullWidth
              errorStyle={errorStyle}
              labelStyle={labelStyle}
              style={inputStyle}
            />
          </div>
          <div className={css.fieldContainer}>
            <Field
              id="number"
              name="number"
              label="Production Number"
              component={TextField}
              type="text"
              fullWidth
              errorStyle={errorStyle}
              labelStyle={labelStyle}
              style={inputStyle}
            />
          </div>
          <div className={css.fieldContainer}>
            <Field
              id="year"
              name="year"
              label="Production Year"
              component={TextField}
              type="text"
              fullWidth
              errorStyle={errorStyle}
              labelStyle={labelStyle}
              style={inputStyle}
            />
          </div>
          <div className={css.fieldContainer}>
            <Field
              type="select"
              name="productionTypeId"
              label={"Production type"}
              component={SelectField}
              fullWidth
              errorStyle={errorStyle}
              labelStyle={labelStyle}
              style={inputStyle}
              className={css.select}
            >
              {this.showProductionsTypes()}
            </Field>
          </div>
          <div className={css.messageError}>{messageError || null}</div>
          <Button
            type="submit"
            disableRipple
            disabled={
              !valid ||
              pristine ||
              !file ||
              editPoster ||
              submitting ||
              asyncValidating
            }
            classes={{
              root: css.nextButton,
              disabled: css.nextButtonDisabled
            }}
          >
            {submitting || asyncValidating ? "Submitting..." : "Next"}
          </Button>
          <div className={css.pagination}>
            <div className={css.step} />
            <div className={css.step} />
            <div className={`${css.step} ${css.stepActive}`} />
            <div className={css.step} />
          </div>
        </form>
      </Layout>
    );
  }
}
