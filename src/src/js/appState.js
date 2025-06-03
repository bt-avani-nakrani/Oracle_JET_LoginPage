// js/appState.js
define(['knockout'], function (ko) {
    return {
        appName: ko.observable("Please Login"),
        userLogin: ko.observable("Guest")
    };
});
