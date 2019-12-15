
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
            mediaTypes : [type],
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


var inspectionDir = Alloy.Globals.inspectionDir;
var maxRowHeight = 92;
var thumbWidth = 90;
function createTableRowForVideos(video_info, videoId) {
    console.log('!!!', video_info);
    var videoThumb = Titanium.Filesystem.getFile(inspectionDir, video_info.video);
    var thumbHeight = (video_info.height / video_info.width) * thumbWidth;
    var row = Titanium.UI.createTableViewRow({
        className : 'caption',
        height : maxRowHeight,
        info : video_info
    });
/*
    row.add(Titanium.UI.createImageView({
        image : video_info.video ? videoThumb.nativePath : '/images/videoPlaying.png', // this is a BLOB now: TODO: store on local file system ...
        top : '5',
        left : '5',
        width : thumbWidth,
        sourceType : 'PlayVideoRow'
    }));*/
    row.add(Titanium.Media.createVideoPlayer({
        url: videoThumb.nativePath,
        //image : video_info.video ? videoThumb.nativePath : '/images/videoPlaying.png', // this is a BLOB now: TODO: store on local file system ...
       
        top : '5',
        left : '5',
        scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
        autoplay: false,
        //width : "352",
        //height : "288",
        width : thumbWidth,
        //sourceType : 'PlayVideoRow'
    }));    
    
    row.add(Titanium.UI.createLabel({
        left : '105',
        right : '50',
        height : Ti.UI.SIZE,
        sourceType : 'VideoRow',
        text : 'Tap to Add Caption',
        color : '#000',
        font : {
            fontSize : '15'
        },
    }));
    
    return row;
};

function updateTableView() {
    var data = [];
    imageSection = Titanium.UI.createTableViewSection({
        headerTitle : "Media"
    });
    
    if (Alloy.Globals.root.pictures.length > 0) {
        for (i in Alloy.Globals.root.pictures) {
            
            var picture = Alloy.Globals.root.pictures[i];
                /*
                 doLog && console.log(LOG_TAG, "picture.menuItem:",picture.menuItem);
                 doLog && console.log(LOG_TAG, "menuItem.title:",menuItem.title);
                 doLog && console.log(LOG_TAG, "picture.section:",menuItem.title);
                 doLog && console.log(LOG_TAG, "damagePanelIndex.title:", ((menuItem.tabbed_panels[panelId]).damage_panels[damagePanelIndex]).title);
                 */
            

            if (picture.isVideo) {
                var row = createTableRowForVideos(picture, i);
                imageSection.add(row);
            } else {
                var row = createTableRowForImages(picture, i);
                imageSection.add(row);
            }
            
        }
    }
    //doLog && console.log(LOG_TAG, "imageSection.rowCount: ", imageSection.rowCount);
    if (imageSection.rowCount > 0)
        data.push(imageSection);

    //doLog && console.log(LOG_TAG, "imageSection.rowCount data: ", data);
    //doLog && console.log(LOG_TAG, "imageSection.rowCount data: ", JSON.stringify(data));
    $.tableView.setData(data);
    
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

            var names = Math.floor(Math.random() * 10000) + 1;
                
                
            var tempFile = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir, names + '.mp4');
                tempFile.write(result.media);

            // create a videoPlayer to display our video
            /*
            var videoPlayer = Ti.Media.createVideoPlayer({
                url: result.media.nativePath,
                //media : e.media,
                scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT,
                autoplay: true,
                width : "352",
                height : "288"
            });
            */ 

            var videoFile = {
                //imageFileName : tmpPhoto.getName(),
                //thumb : tmpPhoto.getName(),
                video : tempFile.getName(),
                isVideo : true
            };

            Alloy.Globals.root.pictures.push(videoFile);
            console.log('~~~> picrres: ', JSON.stringify(Alloy.Globals.root.pictures));
            //scrollView.add(imgView);
            updateTableView(); 

/*
            videoPlayer.requestThumbnailImagesAtTimes([3], Titanium.Media.VIDEO_TIME_OPTION_NEAREST_KEYFRAME, function(response) {
                Ti.API.info("Thumbnail callback called, success = " + response.success);
                Ti.API.info("Thumbnail callback called, time = " + response.time);
                Ti.API.info("Thumbnail callback called, code = " + response.code);
                if(response.success) {
                     var imgView = Titanium.UI.createImageView({
                        image : response.image
                    });
                    var tmpPhoto = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, names + '_thum.png');
                    tmpPhoto.write(response.image); 
            

                    var videoFile = {
                        imageFileName : tmpPhoto.getName(),
                        thumb : tmpPhoto.getName(),
                        video : tempFile.getName(),
                        isVideo : true
                    };
                    
                    Alloy.Globals.root.pictures.push(videoFile); 
                    console.log('~~~> picrres: ', JSON.stringify(Alloy.Globals.root.pictures));
                    //scrollView.add(imgView);
                    updateTableView();
                }
            });
 */
                        

            function setBackgroundImage(thumbResponse, error) {
                //console.log('--> setBackgroundImage() - thumbResponse: ', thumbResponse, ', error: ', error);
                if (error) {
                    alert('could not capture video');
                    return;
                }
                //callback(e);
                

                var thumbanilImage = thumbResponse.image;
                var thumbFile = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir, Alloy.Globals.counterVideos + '.jpg');
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
                        var thumbFileNew = Ti.Filesystem.getFile(Alloy.Globals.inspectionDir, Alloy.Globals.counterVideos + '.jpg');
                        thumbFileNew.write(blob);
                        var videoFile = {
                            imageFileName : thumbFileNew.getName(),
                            thumb : thumbFileNew.getName(),
                            video : tempFile.getName(),
                            isVideo : true
                        };

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

                //$.win.add(videoPlayer);
            
            //videoPlayer.requestThumbnailImagesAtTimes([0], Titanium.Media.VIDEO_TIME_OPTION_NEAREST_KEYFRAME, setBackgroundImage);

            

            // add the videoPlayer to the window
            //$.win.add(videoPlayer);
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
