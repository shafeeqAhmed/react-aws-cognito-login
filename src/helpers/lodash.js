// @flow
/* eslint import/prefer-default-export: 0 */
import { identity, findIndex } from "lodash";

/**
 * upsert updates an item if present in `array`, or add it to `array` otherwise.
 * Returns a copy of `array` with the new item.
 */
export function upsert<T>(
  array: Array<T>,
  newVal: T,
  predicate: Function = identity
): Array<T> {
  const existing = findIndex(array, predicate);

  if (existing === -1) {
    return [...array, newVal];
  }

  const copy = array.slice();
  copy.splice(existing, 1, newVal);
  return copy;
}

// mixin<Function>({ "$upsert": upsert });
