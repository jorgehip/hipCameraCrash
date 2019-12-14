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
(function(){

})();

Alloy.Globals.saveVideo = function (callback){
    require("/permissions").checkCameraPermission(function() {
        var nextVideoId = Math.floor(Math.random() * 100); 
        Ti.Media.showCamera({
            success: function (e) {
                //callback(null, e);
                Ti.API.info("e.media.length:" + e.media.length);
                var tempFile = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir + "/inspections/" + nextVideoId + '.mp4');
                    tempFile.write(e.media);
                
                var videoPlayer = Ti.Media.createVideoPlayer({
                    //url : e.media.nativePath,
                    media : e.media,
                    scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
                    autoplay : true
                });
                
                function setBackgroundImage(thumbResponse, error) {
                    //console.log('--> setBackgroundImage() - thumbResponse: ', thumbResponse, ', error: ', error);
                    if (error) {
                        alert('could not capture video');
                        return;
                    }
                    callback(e);
                
                    var window = Titanium.UI.createWindow();
                    //window.add(imageView);
                    window.open();
                    // add the videoPlayer to the window
                    //$.win.add(videoPlayer);
                }
                //videoPlayer.requestThumbnailImagesAtTimes([0], Titanium.Media.VIDEO_TIME_OPTION_NEAREST_KEYFRAME, setBackgroundImage);
                
            },
            cancel: function (e) {
                callback(e, null);
            },
            error: function (e) {
                callback(e, null);
            },
            mediaTypes : [Titanium.Media.MEDIA_TYPE_VIDEO],
            videoMaximumDuration : 30000,
            videoQuality : Titanium.Media.QUALITY_LOW
            
        });
    });
};
