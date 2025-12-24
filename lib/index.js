"use strict";
/**
 * Copyright (c) Bucher + Suter.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOptions = void 0;
const generate_1 = require("./generate");
const validateOptions_1 = require("./validateOptions");
const path_1 = __importDefault(require("path"));
function default_1(_context, options) {
    let pluginOptions = (0, validateOptions_1.processOptions)(options);
    const res = {
        name: 'docusaurus-plugin-papersaurus',
        async postBuild(props) {
            let forceBuild = process.env.BUILD_PDF || "";
            if ((pluginOptions.autoBuildPdfs && !forceBuild.startsWith("0")) || forceBuild.startsWith("1")) {
                await (0, generate_1.generatePdfFiles)(_context.outDir, pluginOptions, props, _context.i18n.currentLocale);
            }
        },
    };
    if (pluginOptions.addDownloadButton) {
        res.getClientModules = () => {
            return [
                path_1.default.join(__dirname, 'client.js'),
            ];
        };
    }
    return res;
}
exports.default = default_1;
var validateOptions_2 = require("./validateOptions");
Object.defineProperty(exports, "validateOptions", { enumerable: true, get: function () { return validateOptions_2.validateOptions; } });
