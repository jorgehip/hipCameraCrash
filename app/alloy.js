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


(function() {

})();
Alloy.Globals.counterVideos = 1;
Alloy.Globals.saveVideo = function(callback) {
    require("/permissions").checkCameraPermission(function() {
        //var nextVideoId = Math.floor(Math.random() * 100);
        var nextVideoId = Alloy.Globals.counterVideos;
        Ti.Media.showCamera({
            success : function(e) {
                Alloy.Globals.counterVideos = Alloy.Globals.counterVideos+1;
                //callback(null, e);
                Ti.API.info("e.media.length:" + e.media.length);
                var tempFile = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir, nextVideoId + '.mp4');
                tempFile.write(e.media);

                var videoPlayer = Ti.Media.createVideoPlayer({
                    //url : e.media.nativePath,
                    media : e.media,
                    scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
                    autoplay : true
                });

                function setBackgroundImage(thumbResponse, error) {
                    console.log('--> setBackgroundImage() - thumbResponse: ', thumbResponse, ', error: ', error);
                    if (error) {
                        alert('could not capture video');
                        return;
                    }

                    var thumbanilImage = thumbResponse.image;
                    var thumbFile = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir, nextVideoId + '.jpg');
                    thumbFile.write(thumbanilImage);

                    var imageView = Ti.UI.createView({
                        width : "352",
                        height : "288",
                        backgroundImage : thumbFile.nativePath
                    });

                    var lbl = Titanium.UI.createLabel({
                        text : " Video ",
                        backgroundColor : "#fff",
                        font : {
                            fontSize : 20
                        },
                        color : "black",
                        left : 5,
                        top : 5
                    });
                    imageView.add(lbl);
                    var eventCalled = 0;
                    imageView.addEventListener('postlayout', function(e) {
                        if (eventCalled == 0) {
                            eventCalled++;
                            Ti.API.info('Inside postlayout event');
                            Ti.API.info('size : ' + imageView.size.width + ' x ' + imageView.size.height);
                            var blob = imageView.toImage();

                            Ti.API.info("JSON.stringify(blob):" + JSON.stringify(blob));
                            Ti.API.info('blob.length : ' + blob.length);
                            Ti.API.info('blob.apiName : ' + blob.apiName);
                            var thumbFileNew = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir, nextVideoId + '.jpg');
                            thumbFileNew.write(blob);
                            var videoFile = {
                                imageFileName : thumbFileNew.getName(),
                                thumb : thumbFileNew.getName(),
                                video : tempFile.getName(),
                                isVideo : true
                            };
                            
                            Alloy.Globals.root.pictures.push(videoFile); 

                            callback(videoFile);
                            window.close();
                            window.remove(imageView);
                            imageView = null;
                            window = null;
                            blob = null;
                            thumbanilImage = null;
                            thumbFile = null;
                            thumbFileNew = null;
                            blob = null;
                            videoFile = null;
                        }
                    });
                    var window = Titanium.UI.createWindow();
                    window.add(imageView);
                    window.open();

                }


                videoPlayer.requestThumbnailImagesAtTimes([0], Titanium.Media.VIDEO_TIME_OPTION_NEAREST_KEYFRAME, setBackgroundImage);

            },
            cancel : function(e) {
                callback(e, null);
            },
            error : function(e) {
                callback(e, null);
            },
            mediaTypes : [Titanium.Media.MEDIA_TYPE_VIDEO],
            videoMaximumDuration : 30000,
            videoQuality : Titanium.Media.QUALITY_LOW

        });
    });
};
