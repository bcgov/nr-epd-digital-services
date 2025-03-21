/**
 * Retrieves the value at a given path of an object. If the resolved value is undefined, the default value is returned in its place.
 *
 * @param {object} obj - The object to query.
 * @param {string | string[]} path - The path of the property to get. Can be a string with dot and bracket notation or an array of strings.
 * @param {*} [defaultValue] - The value returned if the resolved value is undefined.
 * @returns {*} - Returns the resolved value.
 *
 * @example
 * const obj = { a: { b: { c: 42 } } };
 * get(obj, 'a.b.c'); // => 42
 * get(obj, 'a.b.x', 'default'); // => 'default'
 * get(obj, ['a', 'b', 'c']); // => 42
 * get(obj, 'e[1]'); // => 2
 */
export function get(
  obj: any,
  path: string | string[],
  defautlValue?: any,
): any {
  if (obj === null || obj === undefined) {
    return defautlValue || undefined;
  }

  const pathArray = Array.isArray(path)
    ? path
    : path
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter((key) => key.length);

  const result = pathArray.reduce(
    (acc, key) => ((acc && acc[key]) !== undefined ? acc[key] : undefined),
    obj,
  );

  return result === undefined ? defautlValue : result;
}

/**
 * Sets the value at a given path of an object. If the path does not exist, it will be created.
 *
 * @param {object} obj - The object to modify.
 * @param {string | string[]} path - The path of the property to set. Can be a string with dot and bracket notation or an array of strings.
 * @param {*} value - The value to set.
 * @returns {object} - Returns the modified object.
 *
 * @example
 * const obj = { a: { b: { c: 42 } } };
 * set(obj, 'a.b.c', 100); // => { a: { b: { c: 100 } } }
 * set(obj, 'a.b.x', 'new'); // => { a: { b: { c: 42, x: 'new' } } }
 * set(obj, ['a', 'b', 'd'], 50); // => { a: { b: { c: 42, d: 50 } } }
 * set(obj, 'e[1]', 2); // => { a: { b: { c: 42 } }, e: [undefined, 2] }
 */
export function set(obj: any, path: string | string[], value: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  const pathArray = Array.isArray(path)
    ? path
    : path
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter((key) => key.length);

  pathArray.reduce((acc, key, index) => {
    if (index === pathArray.length - 1) {
      acc[key] = value;
    } else {
      if (acc[key] === undefined) {
        acc[key] = {};
      }
    }
    return acc[key];
  }, obj);

  return obj;
}
