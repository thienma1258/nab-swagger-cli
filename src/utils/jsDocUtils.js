"use strict";
exports.__esModule = true;
exports.isExistJSDocTag = exports.getJSDocTags = exports.getJSDocTagNames = exports.getJSDocComment = exports.getJSDocDescription = void 0;
var ts = require("typescript");
var exceptions_1 = require("../metadataGeneration/exceptions");
function getJSDocDescription(node) {
    var jsDocs = node.jsDoc;
    if (!jsDocs || !jsDocs.length) {
        return undefined;
    }
    return jsDocs[0].comment || undefined;
}
exports.getJSDocDescription = getJSDocDescription;
function getJSDocComment(node, tagName) {
    var tags = getJSDocTags(node, function (tag) { return tag.tagName.text === tagName || tag.tagName.escapedText === tagName; });
    if (tags.length === 0) {
        return;
    }
    return tags[0].comment;
}
exports.getJSDocComment = getJSDocComment;
function getJSDocTagNames(node, requireTagName) {
    if (requireTagName === void 0) { requireTagName = false; }
    var tags;
    if (node.kind === ts.SyntaxKind.Parameter) {
        var parameterName_1 = node.name.text;
        tags = getJSDocTags(node.parent, function (tag) {
            if (ts.isJSDocParameterTag(tag)) {
                return false;
            }
            else if (tag.comment === undefined) {
                throw new exceptions_1.GenerateMetadataError("Orphan tag: @" + String(tag.tagName.text || tag.tagName.escapedText) + " should have a parameter name follows with.");
            }
            return tag.comment.startsWith(parameterName_1);
        });
    }
    else {
        tags = getJSDocTags(node, function (tag) {
            return requireTagName ? tag.comment !== undefined : true;
        });
    }
    return tags.map(function (tag) {
        return tag.tagName.text;
    });
}
exports.getJSDocTagNames = getJSDocTagNames;
function getJSDocTags(node, isMatching) {
    var jsDocs = node.jsDoc;
    if (!jsDocs || jsDocs.length === 0) {
        return [];
    }
    var jsDoc = jsDocs[0];
    if (!jsDoc.tags) {
        return [];
    }
    return jsDoc.tags.filter(isMatching);
}
exports.getJSDocTags = getJSDocTags;
function isExistJSDocTag(node, isMatching) {
    var tags = getJSDocTags(node, isMatching);
    if (tags.length === 0) {
        return false;
    }
    return true;
}
exports.isExistJSDocTag = isExistJSDocTag;
