/**
 * Regex: https://stackoverflow.com/a/19709846
 * @param {String} path
 * @returns {Bool}
 */
function isAbsolutePath(path) {
    const regex = new RegExp('^(?:[a-z]+:)?//', 'i');
    return regex.test(path);
}

export default isAbsolutePath;
