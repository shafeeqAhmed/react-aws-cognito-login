// @flow
import { post } from "src/helpers/api";
import env from "config/env";

const { WALKIE_API_URL } = env;

const prepareFilter = (filters: Object) => {
  let filtersToSend = {};

  let departmentIds = null;
  if (filters.department) {
    departmentIds = filters.department.map(filter => filter.id);

    filtersToSend = {
      ...filtersToSend,
      departmentIds
    };
  }
  let tagIds = null;
  if (filters.tag) {
    tagIds = filters.tag.map(filter => filter.id);

    filtersToSend = {
      ...filtersToSend,
      tagIds
    };
  }
  let permission = null;
  if (filters.permission) {
    permission = filters.permission;

    filtersToSend = {
      ...filtersToSend,
      permission
    };
  }
  if (filters.type) {
    filtersToSend = {
      ...filtersToSend,
      type: filters.type
    };
  }
  return filtersToSend;
};

export default (productionId: number, filter: Object) => {
  if (filter) {
    let params = {};
    if (filter.department || filter.tag || filter.type || filter.permission) {
      params = {
        ...prepareFilter(filter),
        query: filter.text
      };
    } else {
      params = {
        query: filter.text
      };
    }

    return post(
      `${WALKIE_API_URL}/directory/productions/${productionId}/search/users`,
      {
        ...params
      }
    );
  }

  return post(
    `${WALKIE_API_URL}/directory/productions/${productionId}/search/users`,
    {}
  );
};
