// ==UserScript==
// @name         Ad Mockup Assistant
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ad Ops Mockup Tool
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const BUNDLE_URL = 'http://localhost:5173/dist/ad-mockup-assistant.iife.js';
    const script = document.createElement('script');
    script.src = BUNDLE_URL + '?v=' + Date.now();
    document.head.appendChild(script);
})();
