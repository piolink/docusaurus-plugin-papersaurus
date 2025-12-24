"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jquery_1 = __importDefault(require("jquery"));
const ExecutionEnvironment_1 = __importDefault(require("@docusaurus/ExecutionEnvironment"));
const docusaurus_config_1 = __importDefault(require("@generated/docusaurus.config"));
if (ExecutionEnvironment_1.default.canUseDOM) {
    (0, jquery_1.default)(window).on('load', function () {
        const plugin = (docusaurus_config_1.default.plugins || []).find(plugin => Array.isArray(plugin) &&
            typeof plugin[0] === "string" &&
            plugin[0].includes("@uponu-solutions/docusaurus-plugin-papersaurus"));
        if (plugin == null || !Array.isArray(plugin)) {
            console.error("couldn't find plugin config", docusaurus_config_1.default.plugins);
            return;
        }
        const pluginOptions = plugin[1];
        var pdfData = {};
        const getBaseUrl = function () {
            var _a;
            return `${docusaurus_config_1.default.baseUrl}${((_a = docusaurus_config_1.default.baseUrl) === null || _a === void 0 ? void 0 : _a.endsWith("/")) ? "" : "/"}`;
        };
        const getDownloadItems = function () {
            const stripTrailingSlash = (str) => {
                return str.endsWith('/') ?
                    str.slice(0, -1) : str;
            };
            var downloadItems = [];
            var activePdfData = pdfData[stripTrailingSlash(document.location.pathname)] || [];
            for (var i = 0, il = activePdfData.length; i < il; i++) {
                if (activePdfData[i].type === 'root') {
                    downloadItems.push({
                        title: 'Download complete version: <br/> <strong style=font-size:16px>' + activePdfData[i].label + '</strong>',
                        path: getBaseUrl() + activePdfData[i].file
                    });
                    continue;
                }
                if (activePdfData[i].type === 'section') {
                    downloadItems.push({
                        title: 'Download section: <br/> <strong style=font-size:16px>' + activePdfData[i].label + '</strong>',
                        path: getBaseUrl() + activePdfData[i].file
                    });
                    continue;
                }
                if (activePdfData[i].type === 'chapter') {
                    downloadItems.push({
                        title: 'Download page: <br/> <strong style=font-size:16px>' + activePdfData[i].label + '</strong>',
                        path: getBaseUrl() + activePdfData[i].file
                    });
                }
            }
            return downloadItems;
        };
        const fillDownloadDropdownMenu = function () {
            (0, jquery_1.default)('#pdfDownloadMenuList').empty();
            const downloadItems = getDownloadItems();
            var printPopupContent = '';
            downloadItems.forEach(function (downloadItem) {
                printPopupContent += '<li>';
                printPopupContent += '<a class="dropdown__link" href="' + downloadItem.path + '" download>' + downloadItem.title + '</a>';
                printPopupContent += '</li>';
            });
            if (printPopupContent.length === 0) {
                printPopupContent = '<li>No PDF downloads on this page</li>';
            }
            (0, jquery_1.default)("#pdfDownloadMenuList").append(printPopupContent);
        };
        const fillDownloadSidebarMenu = function () {
            (0, jquery_1.default)('#pdfLinkSidebarMenu').empty();
            const downloadItems = getDownloadItems();
            var printMenuContent = '';
            downloadItems.forEach(function (downloadItem) {
                printMenuContent += '<li class="menu__list-item">';
                printMenuContent += '<a class="menu__link" href="' + downloadItem.path + '" download>' + downloadItem.title + '</a>';
                printMenuContent += '</li>';
            });
            if (printMenuContent.length === 0) {
                printMenuContent = '<li>No PDF downloads on this page</li>';
            }
            (0, jquery_1.default)('#pdfLinkSidebarMenu').append(printMenuContent);
        };
        const checkAndInsertPdfButtons = function () {
            if (!(0, jquery_1.default)("html").hasClass("plugin-docs")) {
                return;
            }
            if (!(0, jquery_1.default)("#pdfLink").length) {
                var pdfDownloadButton = (0, jquery_1.default)('' +
                    '<div class="navbar__item dropdown dropdown--hoverable dropdown--right" id="pdfDownloadMenu">' +
                    `  <a class="navbar__item navbar__link pdfLink" id="pdfLink" href="#">${pluginOptions.downloadButtonText}</a>` +
                    '  <ul class="dropdown__menu" id="pdfDownloadMenuList"></ul>' +
                    '</div>');
                (0, jquery_1.default)(".navbar__items--right").prepend(pdfDownloadButton);
                (0, jquery_1.default)("#pdfDownloadMenu").mouseenter(fillDownloadDropdownMenu);
            }
            if (!(0, jquery_1.default)("#pdfLinkSidebar").length) {
                var pdfDownoadButtonSidebar = (0, jquery_1.default)(`<li class="menu__list-item menu__list-item--collapsed" id="pdfLinkSidebar"><a role="button" class="menu__link menu__link--sublist">${pluginOptions.downloadButtonText}</a><ul class="menu__list" id="pdfLinkSidebarMenu" style=""></ul></li>`);
                (0, jquery_1.default)('.navbar-sidebar__items > .menu > .menu__list').append(pdfDownoadButtonSidebar);
                (0, jquery_1.default)('#pdfLinkSidebar').click(function () {
                    (0, jquery_1.default)('#pdfLinkSidebar').toggleClass('menu__list-item--collapsed');
                });
                (0, jquery_1.default)('.navbar__toggle').click(fillDownloadSidebarMenu);
            }
        };
        fetch(getBaseUrl() + 'pdfs.json')
            .then((response) => response.json())
            .then(function (json) {
            pdfData = json;
            checkAndInsertPdfButtons();
            setInterval(checkAndInsertPdfButtons, 1000);
        });
    });
}
