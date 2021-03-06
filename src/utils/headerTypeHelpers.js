"use strict";
exports.__esModule = true;
exports.isSupportedHeaderDataType = exports.getHeaderType = void 0;
var exceptions_1 = require("../metadataGeneration/exceptions");
var typeResolver_1 = require("../metadataGeneration/typeResolver");
function getHeaderType(typeArgumentNodes, index, metadataGenerator) {
    if (!typeArgumentNodes || !typeArgumentNodes[index]) {
        return undefined;
    }
    var candidate = new typeResolver_1.TypeResolver(typeArgumentNodes[index], metadataGenerator).resolve();
    if (candidate && isSupportedHeaderDataType(candidate)) {
        return candidate;
    }
    else if (candidate) {
        throw new exceptions_1.GenerateMetadataError("Unable to parse Header Type " + typeArgumentNodes[index].getText(), typeArgumentNodes[index]);
    }
    return undefined;
}
exports.getHeaderType = getHeaderType;
function isSupportedHeaderDataType(parameterType) {
    var supportedPathDataTypes = ['nestedObjectLiteral', 'refObject'];
    if (supportedPathDataTypes.find(function (t) { return t === parameterType.dataType; })) {
        return true;
    }
    return false;
}
exports.isSupportedHeaderDataType = isSupportedHeaderDataType;
