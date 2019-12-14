
function saveVideo () {
    Alloy.Globals.saveVideo();
    
}

function takeVideos() {
    require("/permissions").checkCameraPermission(function() {
        
        Ti.Media.showCamera({
            success: function (e) {
                //callback(null, e);
                var videoPlayer = Ti.Media.createVideoPlayer({
                    url : e.media.nativePath,
                    //media : e.media,
                    scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
                    autoplay : true
                });

                // add the videoPlayer to the window
                $.win.add(videoPlayer);
            },
            cancel: function (e) {
                //callback(e, null);
            },
            error: function (e) {
                //callback(e, null);
            },
            mediaTypes : [Titanium.Media.MEDIA_TYPE_VIDEO],
            videoMaximumDuration : 30000,
            videoQuality : Titanium.Media.QUALITY_LOW
            
        });
    });
}

$.win.open();
