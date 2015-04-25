'use strict';

const data = require("sdk/self").data;
const pageMod = require("sdk/page-mod");

pageMod.PageMod({
  include: "*.duckduckgo.com",
  contentStyleFile: data.url('buttons.css')
  contentScriptFile: data.url("inject.js"),
  contentScriptWhen: 'ready',
});
