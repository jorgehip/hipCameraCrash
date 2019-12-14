
function updateTableView(){
    console.log('~~> updateTableView()');
};

function takeVideos() {
    Alloy.Globals.saveVideo(function(videoFile) {
        console.log('videoFile----> ', JSON.stringify(videoFile));
        updateTableView();
    });
}

$.win.open();
