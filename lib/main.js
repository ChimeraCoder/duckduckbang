var pageMod = require("sdk/page-mod");
var self = require("sdk/self");

// Create a page mod
// // It will run a script whenever a ".org" URL is loaded
// // The script replaces the page contents with a message
pageMod.PageMod({
    include: "*.duckduckgo.com",
    contentScriptFile: [self.data.url("jquery-2.1.3.min.js"), self.data.url("bang.js")],
    contentStyleFile: self.data.url("bang.css")
});
