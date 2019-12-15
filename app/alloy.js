// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};


// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block

var fdir = "",
    inspectionDir = "";
if (Ti.Filesystem.isExternalStoragePresent()) {
    Alloy.Globals.fdir = Ti.Filesystem.externalStorageDirectory;
    Alloy.Globals.inspectionDir = Ti.Filesystem.externalStorageDirectory;
} else {
    if (OS_ANDROID) {
        Alloy.Globals.fdir = Ti.Filesystem.applicationDataDirectory;
        Alloy.Globals.inspectionDir = Ti.Filesystem.applicationDataDirectory;
    } else {
        Alloy.Globals.fdir = Ti.Filesystem.applicationDataDirectory + "../Library/Caches/";
        Alloy.Globals.fdir.setRemoteBackup = false;
        Alloy.Globals.inspectionDir = Ti.Filesystem.applicationDataDirectory;
    }
}

var root = {};
root.template = [];
root.pictures = [];
root.videos = [];
Alloy.Globals.root = root;


(function(){




})();

Alloy.Globals.saveVideo = function (){
    
};
