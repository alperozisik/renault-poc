/* globals lang */
require("i18n/i18n.js"); // Generates global lang object

const Application = require("sf-core/application");

// Set uncaught exception handler, all exceptions that are not caught will
// trigger onUnhandledError callback.
Application.onUnhandledError = function(e) {
    alert({
        title: lang.applicationError,
        message: e.message + "\n\n*" + e.sourceURL + "\n*" + e.line + "\n*" + e.stack
    });
};

global.imgRuhsat = null;
global.imgRuhsatChanged = null;
global.aracVerisi = null;
global.aracVerisiChanged = null;


const Router = require("sf-core/ui/router");
const stylerBuilder = require("library/styler-builder");
const settings = require("./settings.json");
stylerBuilder.registerThemes(settings.config.theme.themes || "Defaults");
stylerBuilder.setActiveTheme(settings.config.theme.currentTheme);
require("timers-smf");
// Define routes and go to initial page of application
// Router.add("page1", require("./pages/page1"));
// Router.add("page2", require("./pages/page2"));
Router.add("pgGiris", require("./pages/pgGiris"));
Router.add("pgSMS", require("./pages/pgSMS"));
Router.add("pgDashboard", require("./pages/pgDashboard"));
Router.go("pgGiris");


//console.log(Object.keys(global).join("; "));