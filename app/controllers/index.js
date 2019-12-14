
function saveVideo () {
    Alloy.Globals.saveVideo();
    
}
/**
 * showCamera: handle required permissions and display camera for video capture
 *             and photo capture
 *
 * @param type: capture type, can be Ti.Media.MEDIA_TYPE_VIDEO or Ti.Media.MEDIA_TYPE_PHOTO
 * @param callback: callback from camera
 *     @param error: defined when an error has occurred, otherwise null
 *     @param result: result from the camera containing captured media information
 */
function showCamera (type, callback) {
    
    function camera() {
        // call Titanium.Media.showCamera and respond callbacks
        Ti.Media.showCamera({
            success: function (e) {
                callback(null, e);
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
    };
 
    // check if we already have permissions to capture media
    if (!Ti.Media.hasCameraPermissions()) {
 
        // request permissions to capture media
        Ti.Media.requestCameraPermissions(function (e) {
 
            // success! display the camera
            if (e.success) {
                camera();
 
            // oops! could not obtain required permissions
            } else {
                callback(new Error('could not obtain camera permissions!'), null);
            }
        });
    } else {
        camera();
    }
}

function takeVideo(){
    // attempt to capture video with the camera
    showCamera(Ti.Media.MEDIA_TYPE_VIDEO, function (error, result) {
        if (error) {
            alert('could not capture video');
            return;
        }
 
        // validate we taken a video
        if (result.mediaType == Ti.Media.MEDIA_TYPE_VIDEO) {
         
            // create a videoPlayer to display our video
            var videoPlayer = Ti.Media.createVideoPlayer({
                url: result.media.nativePath,
                //media : e.media,
                scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
                autoplay: true
            });
 
            // add the videoPlayer to the window
            $.win.add(videoPlayer);
        }
        
    });
}; 

function showCameras(type, callback) {
    //function camera() {
        // call Titanium.Media.showCamera and respond callbacks
        Ti.Media.showCamera({
            success: function (e) {
                callback(null, e);
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
   // };
}

function takeVideos() {
    require("/permissions").checkCameraPermission(function() {
        showCameras(Ti.Media.MEDIA_TYPE_VIDEO, function(error, result) {
            if (error) {
                alert('could not capture video');
                return;
            }

            // validate we taken a video
            if (result.mediaType == Ti.Media.MEDIA_TYPE_VIDEO) {

                // create a videoPlayer to display our video
                var videoPlayer = Ti.Media.createVideoPlayer({
                    url : result.media.nativePath,
                    //media : e.media,
                    scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
                    autoplay : true
                });

                function setBackgroundImage(thumbResponse, error) {
                    //console.log('--> setBackgroundImage() - thumbResponse: ', thumbResponse, ', error: ', error);
                    if (error) {
                        alert('could not capture video');
                        return;
                    }
                    //callback(e);
                
                    
                    $.win.add(videoPlayer);
                }
                videoPlayer.requestThumbnailImagesAtTimes([0], Titanium.Media.VIDEO_TIME_OPTION_NEAREST_KEYFRAME, setBackgroundImage);
                

                // add the videoPlayer to the window
                //$.win.add(videoPlayer);
            }

        });

    });
}

$.win.open();
