var inspectionDir = Alloy.Globals.inspectionDir;
var maxRowHeight = 92;
var thumbWidth = 90;
function createTableRowForVideos(video_info, videoId) {
    console.log('!!!', video_info);
    var videoThumb = Titanium.Filesystem.getFile(inspectionDir, video_info.thumb);
    var thumbHeight = (video_info.height / video_info.width) * thumbWidth;
    var row = Titanium.UI.createTableViewRow({
        className : 'caption',
        height : maxRowHeight,
        info : video_info
    });

    row.add(Titanium.UI.createImageView({
        image : video_info.thumb ? videoThumb.nativePath : '/images/videoPlaying.png', // this is a BLOB now: TODO: store on local file system ...
        top : '5',
        left : '5',
        width : thumbWidth,
        sourceType : 'PlayVideoRow'
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

function updateTableView(vid){
    console.log('~~> updateTableView()');
    
//  
    // var data = [];
    // imageSection = Titanium.UI.createTableViewSection({
        // headerTitle : "Media"
    // });
//     
    // var row = createTableRowForVideos(vid, 0);
    // imageSection.add(row);
//     
    // console.log( "imageSection.rowCount: ", imageSection.rowCount);
    // if (imageSection.rowCount > 0)
        // data.push(imageSection);
// 
    // $.tableView.setData(data);
    
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

function takeVideos() {
    Alloy.Globals.saveVideo(function(videoFile) {
        console.log('videoFile----> ', JSON.stringify(videoFile));
        updateTableView(videoFile);
    });
}

$.win.open();
