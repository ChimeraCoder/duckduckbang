"use strict";

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

// An example of how to create a string bundle for localization.
XPCOMUtils.defineLazyGetter(this, "Strings", function() {
    return Services.strings.createBundle("chrome://youraddon/locale/youraddon.properties");
});

// An example of how to import a helper module.
XPCOMUtils.defineLazyGetter(this, "Helper", function() {
    let sandbox = {};
    Services.scriptloader.loadSubScript("chrome://youraddon/content/helper.js", sandbox);
    return sandbox["Helper"];
});

var foo = "asdf";
function showToast(aWindow) {
    aWindow.NativeWindow.toast.show(Strings.GetStringFromName("toast.message"), "short");
}

function showDoorhanger(aWindow) {
    let buttons = [
        {
            label: "Button 1",
            callback: function() {
                aWindow.NativeWindow.toast.show("Button 1 was tapped", "short");
            }
        } , {
            label: "Button 2",
            callback: function() {
                aWindow.NativeWindow.toast.show("Button 2 was tapped", "short");
            }
        }];

        foo = aWindow;
        var pageActions = awindow.NativeWindow.pageaction;
        aWindow.NativeWindow.doorhanger.show("Showing a doorhanger with two button choices.", "doorhanger-test", buttons);
}

function copyLink(aWindow, aTarget) {
    let url = aWindow.NativeWindow.contextmenus._getLinkURL(aTarget);
    aWindow.NativeWindow.toast.show("Todo: copy > " + url, "short");
}


var gWindow = window;

function logTabOpen(event) {
    gWindow.console.log("Log_tabs: Opening new tab");
}

function logTabClose(event) {
    let browser = event.target;  
    gWindow.console.log("Log_tabs: Closing: " + browser.currentURI.spec);
    gwindow.console.log(browser.curentURI.spec)
}

function logTabSelect(event) {
    let browser = event.target;  
    gWindow.console.log("Log_tabs: Selecting: " + browser.currentURI.spec);
    gwindow.console.log(browser.curentURI.spec)
    window.alert("something");
    gwindow.alert("something else");
}

var gToastMenuId = null;
var gDoorhangerMenuId = null;
var gContextMenuId = null;



function loadIntoWindow(window) {
    gWindow = window;
    gWindow.console.log("Log tabs: starting");
    window.console.log(window)

    window.BrowserApp.deck.addEventListener("TabOpen", logTabOpen, false);
    window.BrowserApp.deck.addEventListener("TabClose", logTabClose, false);
    window.BrowserApp.deck.addEventListener("TabSelect", logTabSelect, false);

    var tabs = window.BrowserApp.tabs;
    window.console.log(window.BrowserApp)



    gToastMenuId = window.NativeWindow.menu.add("Show Toast", null, function() { showToast(window); });
    gDoorhangerMenuId = window.NativeWindow.menu.add("Show Doorhanger", null, function() { showDoorhanger(window); });
    gContextMenuId = window.NativeWindow.contextmenus.add("Copy Link", window.NativeWindow.contextmenus.linkOpenableContext, function(aTarget) { copyLink(window, aTarget); });

    console.log("loaded menu");
    console.log(window.BrowserApp)
    console.log(window)
}

function unloadFromWindow(window) {
    window.NativeWindow.menu.remove(gToastMenuId);
    window.NativeWindow.menu.remove(gDoorhangerMenuId);
    window.NativeWindow.contextmenus.remove(gContextMenuId);



    window.BrowserApp.deck.removeEventListener("TabOpen", logTabOpen, false);
    window.BrowserApp.deck.removeEventListener("TabClose", logTabClose, false);
    window.BrowserApp.deck.removeEventListener("TabSelect", logTabSelect, false);
}

/**
 * bootstrap.js API
 */
var windowListener = {
    onOpenWindow: function(aWindow) {
        // Wait for the window to finish loading
        function loadListener() {
            domWindow.removeEventListener("load", loadListener, false);
            loadIntoWindow(domWindow);
        };
        domWindow.addEventListener("load", loadListener, false);
    },

    onCloseWindow: function(aWindow) {
    },

    onWindowTitleChange: function(aWindow, aTitle) {
        if(window.location.hostname === "duckduckgo.com"){
            injectTabs()
        }
    }
};

function startup(aData, aReason) {
    // Load into any existing windows
    let windows = Services.wm.getEnumerator("navigator:browser");
    while (windows.hasMoreElements()) {
        let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
        loadIntoWindow(domWindow);
    }

    // Load into any new windows
    Services.wm.addListener(windowListener);
}

function shutdown(aData, aReason) {
    // When the application is shutting down we normally don't have to clean
    // up any UI changes made
    if (aReason == APP_SHUTDOWN) {
        return;
    }

    // Stop listening for new windows
    Services.wm.removeListener(windowListener);

    // Unload from any existing windows
    let windows = Services.wm.getEnumerator("navigator:browser");
    while (windows.hasMoreElements()) {
        let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
        unloadFromWindow(domWindow);
    }
}

function install(aData, aReason) {
}

function uninstall(aData, aReason) {
}


var getQuery = function(){
    return document.getElementById("search_form_input").value;
};

function urlBuilder(query, bang){
    return "https://duckduckgo.com/?q=" + bang + "%20" + query;
}

function linkBuilder(query, bang){
    var url = urlBuilder(query, bang);

    var val = document.createElement("div");
    val.innerHTML = "<a class='button bang-btn' href='" + url + "'>" + bang + "</a>";

    return val;
}

function injectTabs(){
    var query = getQuery();
    var linksElem = document.getElementById("links");

    linksElem.insertBefore(linkBuilder(query, "!yt"), linksElem.firstChild);
    linksElem.insertBefore(linkBuilder(query, "!g"),  linksElem.firstChild);
    //$("#links").prepend(linkBuilder(query, "!yt"));
    //$("#links").prepend(linkBuilder(query, "!g"));
}


