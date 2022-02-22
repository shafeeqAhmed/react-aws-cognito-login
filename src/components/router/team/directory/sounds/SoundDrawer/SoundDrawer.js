/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React, { PureComponent } from "react";
import Moment from "moment";
import { difference, get } from "lodash";
import { upsert } from "src/helpers/lodash";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { TextField as FormTextField } from "formik-material-ui";
import Sound from "react-sound";
import FormHelperText from "@material-ui/core/FormHelperText";
import Downshift from "downshift";
import TagChip from "src/components/shared/Tag";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import EmptySoundIcon from "static/images/empty-sound.svg";
import SoundWave from "src/components/shared/SoundWave";
import PlayIcon from "static/images/play.svg";
import PauseIcon from "static/images/pause.svg";
import { type Tag, TagTypes, EntityTypes } from "src/redux/modules/tags";
import type { Props } from "./";
import css from "./SoundDrawer.styles.css";

type State = {|
  url: ?string,
  position: ?number,
  duration: ?number,
  playStatus: ?$Keys<typeof Sound.status>
|};

type FormValues = {|
  file: File,
  name: string,
  description: string,
  tags: Array<Tag>,
  addAnother: boolean
|};

export default class SoundDrawer extends PureComponent<Props, State> {
  state: State = {
    url: null,
    position: null,
    duration: null,
    playStatus: Sound.status.PLAYING
  };

  onLoadingSound = ({ duration }: { duration: number }) => {
    if (duration) this.setState({ duration });
  };

  onLoadSound = ({ loaded }: { loaded: boolean }) => {
    if (loaded) this.setState({ playStatus: Sound.status.STOPPED });
  };

  onPlayingSound = ({
    position,
    duration
  }: {
    position: number,
    duration: number
  }) => {
    this.setState({ position, duration });
  };

  onResumeSound = ({
    position,
    duration
  }: {
    position: number,
    duration: number
  }) => {
    this.setState({ position, duration });
  };

  onPauseSound = ({
    position,
    duration
  }: {
    position: number,
    duration: number
  }) => {
    this.setState({ position, duration });
  };

  // eslint-disable-next-line react/no-unused-prop-types
  onStoppedSound = ({ duration }: { duration: number }) => {
    this.setState({ duration, position: 0 });
  };

  onClickPlay = () => {
    this.setState(state => ({
      playStatus:
        state.playStatus === Sound.status.PLAYING
          ? Sound.status.PAUSED
          : Sound.status.PLAYING
    }));
  };

  onClickDeleteSound = () => {
    const { deleteSound, sound, team, onClose } = this.props;
    if (!sound) return;

    deleteSound({ teamId: team.id, soundId: sound.id });
    onClose && onClose();
  };

  tagSuggestions = () => {
    const { tagSearch } = this.props;

    let tagSuggestions = tagSearch.select.map(value => ({
      value,
      label: value.name
    }));

    if (
      tagSearch.query.term &&
      !tagSuggestions.some(t => t.label === tagSearch.query.term)
    ) {
      tagSuggestions = [
        {
          value: {
            id: `new-${tagSearch.query.term}`,
            name: `${tagSearch.query.term}`
          },
          label: `Create tag "${tagSearch.query.term}"`
        },
        ...tagSuggestions
      ];
    }

    return tagSuggestions;
  };

  progress = () => {
    const { duration, position } = this.state;

    return typeof duration === "number"
      ? Math.min(
          Math.floor(
            (typeof position === "number" ? position : duration) /
              duration *
              100
          ),
          100
        )
      : 100;
  };

  onSubmit = async (
    values: FormValues,
    {
      setSubmitting,
      resetForm
    }: {
      setSubmitting: (submitting: boolean) => void,
      resetForm: (nextValues?: FormValues) => void
    }
  ) => {
    console.log("submitting");

    const { onClose, sound } = this.props;

    if (sound) {
      await this.updateSound(values);
    } else {
      await this.createSound(values, { resetForm });
    }

    setSubmitting(false);
    values.addAnother || onClose();
  };

  createTags = async (tags: Array<Tag>): Promise<Array<Tag>> => {
    const { createTag, team } = this.props;
    const res = await Promise.all(
      tags.map(t => createTag({ teamId: team.id, name: t.name }))
    );
    const now = new Date().toISOString();

    return res.map(r => ({
      name: get(r, "action.meta.request.name"),
      team_id: get(r, "action.meta.request.teamId", team.id),
      created_at: now,
      updated_at: now,
      ...get(r, "action.payload.data", {})
    }));
  };

  uploadSound = async (values: FormValues) => {
    const { uploadSound, team } = this.props;
    const now = new Date().toISOString();

    const soundUpload = await uploadSound({
      teamId: team.id,
      blob: values.file,
      name: values.name,
      description: values.description
    });

    return {
      team_id: get(soundUpload, "action.meta.request.teamId", team.id),
      name: get(soundUpload, "action.meta.request.name", ""),
      productions: [],
      description: get(soundUpload, "action.meta.request.description", ""),
      created_at: now,
      updated_at: now,
      ...get(soundUpload, "action.payload.data.sound", {})
    };
  };

  createSound = async (
    values: FormValues,
    { resetForm }: { resetForm: (nextValues?: FormValues) => void }
  ) => {
    const { addTagToEntity, team } = this.props;

    const existingTags = values.tags.filter(t => t.id !== `new-${t.name}`);
    const newTags = await this.createTags(
      values.tags.filter(t => t.id === `new-${t.name}`)
    );
    const tags = [...existingTags, ...newTags];

    const sound = await this.uploadSound(values);

    // add tags to sound
    await Promise.all(
      tags.map(t =>
        addTagToEntity({
          teamId: team.id,
          tagId: t.id,
          tagType: TagTypes.TAG,
          entityType: EntityTypes.SOUND,
          entityId: sound.id
        })
      )
    );

    resetForm();
    this.setState({
      url: null,
      position: null,
      duration: null,
      playStatus: Sound.status.PLAYING
    });
  };

  updateSound = async (values: FormValues) => {
    console.log("updating...");

    const {
      addTagToEntity,
      removeTagFromEntity,
      sound,
      team,
      updateSound
    } = this.props;

    const oldTagIds = sound.tags.map(t => t.id);
    const newTags = await this.createTags(
      values.tags.filter(t => t.id === `new-${t.name}`)
    );
    const newTagIds = [
      ...values.tags.filter(t => t.id !== `new-${t.name}`),
      ...newTags
    ].map(t => t.id);

    const tagIdsToRemove = difference(oldTagIds, newTagIds);
    const tagIdsToAdd = difference(newTagIds, oldTagIds);

    const addingTags = tagIdsToAdd.map(tagId =>
      addTagToEntity({
        teamId: team.id,
        tagId,
        tagType: TagTypes.TAG,
        entityType: EntityTypes.SOUND,
        entityId: sound.id
      })
    );

    const removingTags = tagIdsToRemove.map(tagId =>
      removeTagFromEntity({
        teamId: team.id,
        tagId,
        tagType: TagTypes.TAG,
        entityType: EntityTypes.SOUND,
        entityId: sound.id
      })
    );

    const updatingSound = updateSound({
      teamId: team.id,
      soundId: sound.id,
      name: values.name,
      description: values.description
    });

    return Promise.all([updatingSound, ...addingTags, ...removingTags]);
  };

  validate = (values: FormValues) => {
    const { sound } = this.props;
    const errors = {};

    if (!get(sound, "name") && !values.name) {
      errors.name = "Required";
    }

    if (!sound && !values.file) {
      errors.file = "Required";
    }

    return errors;
  };

  render() {
    const { url, duration, position, playStatus } = this.state;
    const { sound, tagSearch, searchTags, open, onClose, team } = this.props;
    const playUrl = sound ? sound.play_url : url;

    return (
      <Drawer
        className={css.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        onClose={onClose}
        classes={{
          root: open ? "" : css.closed,
          paper: css.drawerPaper
        }}
      >
        <div className={css.toolbar} />

        <div className={css.controlsArea}>
          <IconButton onClick={onClose} className={css.closeIconButton}>
            <CloseIcon className={css.closeIcon} />
          </IconButton>
        </div>

        <div className={css.titlesArea}>
          <span className={css.titleText}>
            {sound ? "Edit Sound" : "Create Sound"}
          </span>
          <span className={css.subtitleText}>{get(team, "name", "")}</span>
        </div>

        <Formik
          initialValues={{
            name: sound ? sound.name : "",
            description: sound ? sound.description : "",
            file: null,
            addAnother: false,
            tags: sound ? sound.tags : []
          }}
          enableReinitialize
          validate={this.validate}
          onSubmit={this.onSubmit}
        >
          {({ isSubmitting, setFieldValue, submitForm, values, errors }) => (
            <Form>
              {!playUrl && (
                <div className={css.uploadArea}>
                  <label htmlFor="file" className={css.fileInputLabel}>
                    <img
                      src={EmptySoundIcon}
                      alt="upload sound"
                      className={css.emptySoundImage}
                    />
                    <span className={css.emptySoundText}>
                      Click here to upload sound
                    </span>
                    <ErrorMessage
                      name="file"
                      component={() => (
                        <FormHelperText error>{errors.file}</FormHelperText>
                      )}
                      className={css.fileErrorMessage}
                    />
                    <input
                      id="file"
                      name="file"
                      type="file"
                      className={css.fileInput}
                      onChange={event => {
                        const file = event.currentTarget.files[0];

                        // eslint-disable-next-line no-undef
                        const reader = new FileReader();
                        reader.onload = e => {
                          this.setState({ url: e.target.result });
                        };

                        reader.readAsDataURL(file);

                        setFieldValue("name", file.name);
                        setFieldValue("file", file, true);
                      }}
                    />
                  </label>
                </div>
              )}

              {playUrl && (
                <div className={css.soundArea}>
                  <Sound
                    url={playUrl}
                    onLoading={this.onLoadingSound}
                    onLoad={this.onLoadSound}
                    onPlaying={this.onPlayingSound}
                    onPause={this.onPauseSound}
                    onStopped={this.onStoppedSound}
                    onResume={this.onResumeSound}
                    playStatus={playStatus}
                  />

                  <SoundWave
                    progress={this.progress()}
                    className={css.soundImage}
                  />

                  <span className={css.soundDuration}>
                    {position || duration
                      ? Moment.utc(position || duration || "").format("mm:ss")
                      : "--:--"}
                  </span>

                  <IconButton onClick={this.onClickPlay}>
                    <img
                      src={
                        playStatus === Sound.status.PLAYING
                          ? PauseIcon
                          : PlayIcon
                      }
                      alt="play sound"
                      className={css.playSoundImage}
                    />
                  </IconButton>
                </div>
              )}

              <div className={css.fieldsArea}>
                <Field
                  type="text"
                  name="name"
                  component={FormTextField}
                  fullWidth
                  label="Title"
                  className={css.textField}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={css.errorMessage}
                />

                <Field
                  type="text"
                  name="description"
                  component={FormTextField}
                  fullWidth
                  multiline
                  label="Description / Notes"
                  className={css.textField}
                />

                <Downshift
                  inputValue={tagSearch.query.term}
                  onChange={tag => {
                    setFieldValue(
                      "tags",
                      upsert(values.tags, tag, t => t.id === tag.id)
                    );
                    searchTags({ teamId: team.id, name: "" });
                  }}
                  selectedItem={values.tags}
                >
                  {({
                    getInputProps,
                    getItemProps,
                    isOpen,
                    inputValue,
                    selectedItems,
                    highlightedIndex,
                    selectItemAtIndex,
                    selectHighlightedItem
                  }) => (
                    <div className={css.tagsFieldRoot}>
                      <TextField
                        fullWidth
                        InputProps={getInputProps({
                          classes: {
                            root: css.tagsInputRoot,
                            input: css.tagsInputInput
                          },
                          startAdornment: values.tags.map(
                            tag =>
                              tag ? (
                                <TagChip
                                  key={tag.id}
                                  classes={{
                                    root: css.tagChip
                                  }}
                                  tag={tag}
                                  tagType={TagTypes.TAG}
                                />
                              ) : null
                          ),
                          value: inputValue,
                          onChange: e => {
                            searchTags({
                              teamId: team.id,
                              name: e.target.value
                            });
                          },
                          onKeyDown: e => {
                            if (
                              values.tags.length &&
                              !tagSearch.query.term.length &&
                              e.key === "Backspace"
                            ) {
                              e.preventDefault();
                              e.stopPropagation();

                              setFieldValue(
                                "tags",
                                values.tags.slice(0, values.tags.length - 1)
                              );

                              return false;
                            }

                            if (
                              tagSearch.query.term.length &&
                              e.key === "Enter"
                            ) {
                              e.preventDefault();
                              e.stopPropagation();

                              if (
                                typeof highlightedIndex !== "number" ||
                                highlightedIndex === -1
                              ) {
                                selectItemAtIndex(0);
                              } else {
                                selectHighlightedItem();
                              }

                              return false;
                            }

                            return true;
                          }
                        })}
                        label="Tags"
                      />
                      {isOpen ? (
                        <Paper className={css.paper} square>
                          {this.tagSuggestions().map((suggestion, index) => (
                            <MenuItem
                              {...getItemProps({ item: suggestion.value })}
                              key={suggestion.value.id}
                              selected={highlightedIndex === index}
                              component="div"
                              style={{
                                fontWeight: values.tags
                                  .map(t => t.id)
                                  .includes(suggestion.value.id)
                                  ? 500
                                  : 400
                              }}
                            >
                              {suggestion.label}
                            </MenuItem>
                          ))}
                        </Paper>
                      ) : null}
                    </div>
                  )}
                </Downshift>
              </div>

              <div className={css.actionsArea}>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                  classes={{
                    root: css.buttonRoot
                  }}
                >
                  {sound ? "Save" : "Create Sound"}
                </Button>

                {!sound && (
                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setFieldValue("addAnother", true, false);
                      submitForm();
                    }}
                    classes={{
                      root: css.buttonRoot
                    }}
                  >
                    Create & Add Another
                  </Button>
                )}

                {sound && (
                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    type="button"
                    onClick={this.onClickDeleteSound}
                    classes={{
                      root: css.buttonRoot
                    }}
                  >
                    Delete Sound
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Drawer>
    );
  }
}
