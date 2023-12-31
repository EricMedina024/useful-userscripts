// ==UserScript==
// @name         Userstyles.org downloader
// @namespace    https://ericmedina024.com/
// @version      0.1
// @description  d!
// @author       Eric Medina (ericmedina024)
// @match        https://userstyles.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=userstyles.org
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    const downloadString = function downloadString(fileName, contentType, stringToDownload) {
        const downloadAnchor = document.createElement("a");
        downloadAnchor.href = URL.createObjectURL(new Blob([stringToDownload], {type : contentType}));
        downloadAnchor.target = "_blank";
        downloadAnchor.download = fileName;
        downloadAnchor.click();
    };

    const isInstallButton = function isInstallButton(element) {
        return element.closest("[data-stylish='install-style-button']") !== null;
    };

    const getCurrentStyleId = function getCurrentStyleId() {
        return document.location.pathname.split("/")[2];
    };

    const getStyleDetails = function getStyleDetails(styleId) {
        return fetch(`https://userstyles.org/styles/chrome/${styleId}.json`)
            .then(response => response.json());
    };

    const getStyleCode = function getStyleCode(styleDetails) {
        let styleCode = "";
        styleDetails.sections.forEach((section, index) => {
            const {code, ...sectionWithoutCode} = section;
            styleCode += `/* Section ${index + 1} - ${CSS.escape(JSON.stringify(sectionWithoutCode))} */`;
            styleCode += "\n";
            styleCode += code;
            styleCode += "\n";
        });
        return styleCode;
    };

    document.addEventListener("click", event => {
        if (isInstallButton(event.target)) {
            const currentStyleId = getCurrentStyleId();
            getStyleDetails(currentStyleId)
                .then(getStyleCode)
                .then(styleCode => downloadString(`userstyles-style-${currentStyleId}.css`, "text/css", styleCode));
            event.preventDefault();
        }
    });

})();
