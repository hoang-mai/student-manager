/**
 * Converts a snake_case string to camelCase.
 */
export const snakeToCamel = (str: string): string =>
  str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );

/**
 * Recursively converts object keys from snake_case to camelCase.
 */
export const keysToCamel = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToCamel(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [snakeToCamel(key)]: keysToCamel(obj[key]),
      }),
      {}
    );
  }
  return obj;
};
