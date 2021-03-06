"use strict";
exports.__esModule = true;
exports.importClassesFromDirectories = void 0;
var path = require("path");
/**
 * Loads all exported classes from the given directory.
 */
function importClassesFromDirectories(directories, formats) {
    if (formats === void 0) { formats = ['.ts']; }
    var allFiles = directories.reduce(function (allDirs, dir) {
        return allDirs.concat(require('glob').sync(path.normalize(dir)));
    }, []);
    return allFiles.filter(function (file) {
        var dtsExtension = file.substring(file.length - 5, file.length);
        return formats.indexOf(path.extname(file)) !== -1 && dtsExtension !== '.d.ts';
    });
}
exports.importClassesFromDirectories = importClassesFromDirectories;
