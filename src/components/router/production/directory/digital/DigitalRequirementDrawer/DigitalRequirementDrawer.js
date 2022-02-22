/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
// @flow
import React, { PureComponent } from "react";
import { difference, get } from "lodash";
import { upsert } from "src/helpers/lodash";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { TextField as FormTextField } from "formik-material-ui";
import Downshift from "downshift";
import TagChip from "src/components/shared/Tag";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import HeroIcon from "static/images/digital-requirement.svg";
import FilledSoundIcon from "static/images/filled-sound-2.png";
import { type Tag, TagTypes, EntityTypes } from "src/redux/modules/tags";
import { type Sound } from "src/redux/modules/sounds";
import { ElementItemTypes } from "src/redux/modules/elements";
import type { Props } from "./";
import css from "./DigitalRequirementDrawer.styles.css";

type FormValues = {|
  name: string,
  tags: Array<Tag>,
  items: Array<Sound>,
  addAnother: boolean
|};

export default class DigitalRequirementDrawer extends PureComponent<Props> {
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
          label: `Create "${tagSearch.query.term}"`
        },
        ...tagSuggestions
      ];
    }

    return tagSuggestions;
  };

  soundSuggestions = () => {
    const { soundSearch } = this.props;

    return soundSearch.select.map(value => ({
      value,
      label: value.name
    }));
  };

  onClickDeleteElement = ({
    resetForm
  }: {
    resetForm: (nextValues?: FormValues) => void
  }) => {
    const { element, deleteElement, production, onClose } = this.props;
    if (!element) return;

    deleteElement({
      productionId: production.id,
      elementId: element.id
    });

    resetForm();
    onClose();
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
    const { onClose, element } = this.props;

    if (element) {
      await this.updateElement(values);
    } else {
      await this.createElement(values, { resetForm });
    }

    setSubmitting(false);
    values.addAnother || onClose();
  };

  createTags = async (tags: Array<Tag>): Promise<Array<Tag>> => {
    const { createTag, production } = this.props;
    const res = await Promise.all(
      tags.map(t =>
        createTag({ teamId: get(production, "team.id"), name: t.name })
      )
    );
    const now = new Date().toISOString();

    return res.map(r => ({
      name: get(r, "action.meta.request.name"),
      team_id: get(r, "action.meta.request.teamId", get(production, "team.id")),
      created_at: now,
      updated_at: now,
      ...get(r, "action.payload.data", {})
    }));
  };

  createElement = async (
    values: FormValues,
    { resetForm }: { resetForm: (nextValues?: FormValues) => void }
  ) => {
    console.log("creating...", values);

    const { category, createElement, addTagToEntity, production } = this.props;

    const existingTags = values.tags.filter(t => t.id !== `new-${t.name}`);
    const newTags = await this.createTags(
      values.tags.filter(t => t.id === `new-${t.name}`)
    );
    const tags = [...existingTags, ...newTags];

    const res = await createElement({
      productionId: production.id,
      name: values.name,
      categoryId: category.id
    });

    const entityId = get(res, "action.payload.data.id", "");

    // add production groups to element
    if (entityId) {
      await Promise.all(
        tags.map(t =>
          addTagToEntity({
            teamId: get(production, "team.id"),
            tagId: t.id,
            tagType: TagTypes.PRODUCTION_GROUP,
            entityType: EntityTypes.ELEMENT,
            entityId,
            productionId: production.id
          })
        )
      );
    }

    resetForm();
  };

  updateElement = async (values: FormValues) => {
    console.log("updating...", values);

    const {
      addTagToEntity,
      removeTagFromEntity,
      addItemToElement,
      removeItemFromElement,
      element,
      production,
      updateElement
    } = this.props;

    const oldTagIds = element.tags.map(t => t.tag_id);
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
        teamId: get(production, "team.id"),
        tagId,
        tagType: TagTypes.PRODUCTION_GROUP,
        entityType: EntityTypes.ELEMENT,
        entityId: element.id,
        productionId: production.id
      })
    );

    const removingTags = tagIdsToRemove.map(tagId =>
      removeTagFromEntity({
        teamId: get(production, "team.id"),
        tagId,
        tagType: TagTypes.PRODUCTION_GROUP,
        entityType: EntityTypes.ELEMENT,
        entityId: element.id
      })
    );

    const oldItemIds = element.items.map(i => i.item_id);
    const newItemIds = values.items.map(i => i.id);

    const itemIdsToRemove = difference(oldItemIds, newItemIds);
    const itemIdsToAdd = difference(newItemIds, oldItemIds);

    const addingItems = itemIdsToAdd.map(itemId =>
      addItemToElement({
        productionId: production.id,
        elementId: element.id,
        itemType: ElementItemTypes.SOUND,
        itemId
      })
    );

    const removingItems = itemIdsToRemove.map(itemId =>
      removeItemFromElement({
        productionId: production.id,
        elementId: element.id,
        itemId
      })
    );

    const updatingElement = updateElement({
      productionId: production.id,
      elementId: element.id,
      name: values.name
    });

    return Promise.all([
      updatingElement,
      ...addingTags,
      ...removingTags,
      ...addingItems,
      ...removingItems
    ]);
  };

  validate = (values: FormValues) => {
    const { element } = this.props;
    const errors = {};

    // name is required
    if (!get(element, "name") && !values.name) {
      errors.name = "Required";
    }

    return errors;
  };

  render() {
    const {
      element,
      tagSearch,
      searchTags,
      soundSearch,
      searchSounds,
      open,
      onClose,
      production,
      sounds
    } = this.props;

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
            {element ? "Edit Digital Requirement" : "New Digital Requirement"}
          </span>
          <span className={css.subtitleText}>
            {get(production, "name", "")}
          </span>
          <img src={HeroIcon} alt="" className={css.heroIcon} />
        </div>

        <Formik
          initialValues={{
            name: element ? element.name : "",
            tags: element
              ? element.tags.map(t => ({
                  id: t.tag_id,
                  type: t.tag_type,
                  name: t.tag_name
                }))
              : [],
            items: element ? element.items.map(i => sounds[i.item_id]) : [],
            addAnother: false
          }}
          enableReinitialize
          validate={this.validate}
          onSubmit={this.onSubmit}
        >
          {({
            isSubmitting,
            setFieldValue,
            submitForm,
            values,
            errors,
            resetForm
          }) => (
            <Form>
              <div className={css.fieldsArea}>
                <Field
                  type="text"
                  name="name"
                  component={FormTextField}
                  fullWidth
                  label="Requirement Name"
                  className={css.textField}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={css.errorMessage}
                />

                <Downshift
                  inputValue={tagSearch.query.term}
                  onChange={tag => {
                    setFieldValue(
                      "tags",
                      upsert(values.tags, tag, t => t.id === tag.id)
                    );
                    searchTags({
                      teamId: get(production, "team.id"),
                      name: ""
                    });
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
                                  tagType={TagTypes.PRODUCTION_GROUP}
                                />
                              ) : null
                          ),
                          value: inputValue,
                          onChange: e => {
                            searchTags({
                              teamId: get(production, "team.id"),
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
                        label="Production Groups"
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

                <Downshift
                  inputValue={soundSearch.query.term}
                  onChange={sound => {
                    setFieldValue(
                      "items",
                      upsert(values.items, sound, s => s.id === sound.id)
                    );
                    searchSounds({
                      teamId: get(production, "team.id"),
                      name: ""
                    });
                  }}
                  selectedItem={values.items}
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
                          value: inputValue,
                          onChange: e => {
                            searchSounds({
                              teamId: get(production, "team.id"),
                              name: e.target.value
                            });
                          },
                          onKeyDown: e => {
                            if (
                              soundSearch.query.term.length &&
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
                        label="Add Sound"
                      />
                      {isOpen ? (
                        <Paper className={css.paper} square>
                          {this.soundSuggestions().map((suggestion, index) => (
                            <MenuItem
                              {...getItemProps({ item: suggestion.value })}
                              key={suggestion.value.id}
                              selected={highlightedIndex === index}
                              component="div"
                              style={{
                                fontWeight: values.items
                                  .map(s => s.id)
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

                <div className={css.itemList}>
                  {values.items.map(sound => (
                    <div key={sound.id} className={css.soundItem}>
                      <img
                        src={FilledSoundIcon}
                        alt=""
                        className={css.soundItemIcon}
                      />
                      <span className={css.soundItemName}>
                        {`${sound.name} (${String(sound.team_order).padStart(
                          5,
                          "0"
                        )})`}
                      </span>
                      <IconButton
                        onClick={() => {
                          setFieldValue(
                            "items",
                            values.items.filter(s => s.id !== sound.id)
                          );
                        }}
                        className={css.soundItemRemoveIconButton}
                      >
                        <CloseIcon className={css.soundItemRemoveIcon} />
                      </IconButton>
                    </div>
                  ))}
                </div>
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
                  {element ? "Save" : "Create Requirement"}
                </Button>

                {!element && (
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

                {element && (
                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    type="button"
                    onClick={() => this.onClickDeleteElement({ resetForm })}
                    classes={{
                      root: css.buttonRoot
                    }}
                  >
                    Delete Requirement
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
