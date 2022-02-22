// ƒlow
import moment from "moment";

const FIELDS = [
  { name: "primaryTelephone", type: "PRIMARY_PHONE" },
  { name: "primaryAddress", type: "PRIMARY_ADDRESS" },
  { name: "twitter", type: "TWITTER" },
  { name: "website", type: "WEBSITE" },
  { name: "imdb", type: "IMDB" },
  { name: "dob", type: "DATE_OF_BIRTH" },
  { name: "gender", type: "GENDER" },
  { name: "ethnicity", type: "ETHNICITY" },
  { name: "information", type: "INFORMATION" }
];

const EXTRA_FIELDS = [
  { name: "additionalWebsite", type: "ADDITIONAL_WEBSITE" },
  { name: "additionalTelephone", type: "ADDITIONAL_PHONE" },
  { name: "additionalAddress", type: "ADDITIONAL_ADDRESS" }
];

export const mapStateToApi = values => {
  const details = [];
  values.additionalAddress &&
    values.additionalAddress.forEach(data => {
      if (data) {
        details.push({
          type: "ADDITIONAL_ADDRESS",
          value: data
        });
      }
    });

  values.additionalTelephone &&
    values.additionalTelephone.forEach(data => {
      if (data) {
        details.push({
          type: "ADDITIONAL_PHONE",
          value: data.replace(/[- )(]/g, "")
        });
      }
    });

  values.additionalWebsite &&
    values.additionalWebsite.forEach(data => {
      if (data) {
        details.push({
          type: "ADDITIONAL_WEBSITE",
          value: data
        });
      }
    });

  FIELDS.forEach(field => {
    if (values[field.name]) {
      let value = values[field.name];

      if (field.name === "dob") {
        value = moment(values[field.name]).format("YYYY-MM-DD");
      }

      if (field.name === "primaryTelephone") {
        value = values[field.name].replace(/[- )(]/g, "");
      }

      details.push({
        type: field.type,
        value
      });
    }
  });

  return details;
};

export const mapApiToState = values => {
  const details = {};

  if (values) {
    values.forEach(value => {
      const fieldInfo = FIELDS.find(field => field.type === value.type);
      if (fieldInfo) details[fieldInfo.name] = value.value;

      const extraFieldInfo = EXTRA_FIELDS.find(
        field => field.type === value.type
      );
      if (extraFieldInfo) {
        if (details[extraFieldInfo.name]) {
          details[extraFieldInfo.name] = [
            ...details[extraFieldInfo.name],
            value.value
          ];
        } else {
          details[extraFieldInfo.name] = [value.value];
        }
      }
    });
  }

  EXTRA_FIELDS.forEach(fieldInfo => {
    if (!details[fieldInfo.name]) {
      details[fieldInfo.name] = [""];
    }
  });

  return details;
};

export default {
  mapStateToApi,
  mapApiToState
};
