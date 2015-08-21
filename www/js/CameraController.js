angular.module('starter.controllers', [])

.controller('CameraCtl', function($scope, $stateParams, GalleryService) {
    var _video = null,  patData = null;
    $scope.newPic =  {};
    $scope.cameraReady = false;
    $scope.webcamError = false;
    $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};
    $scope.hasGallery = false;
    $scope.picReady = false;
    $scope.galleryCount = 0;

    function onFailure(err) {
        alert("The following error occured: " + err.name);
        $scope.cameraReady = false;
    }

    var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _video.width;
        hiddenCanvas.height = _video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _video.width, _video.height);
        return ctx.getImageData(x, y, w, h);
    };

    // init camera from callbacks
    $scope.onError = function (err) {
        $scope.$apply(
            function() {
                $scope.webcamError = err;
            }
        );
    };

    // callback on webcam instantiation
    $scope.onSuccess = function (videoElem) {
        // The video element contains the captured camera data
        _video = videoElem;
        $scope.$apply(function() {
            $scope.patOpts.w = _video.width;
            $scope.patOpts.h = _video.height;
            $scope.cameraReady = true;
            $scope.picReady = false;
            $scope.galleryCount = GalleryService.getPics().length;
            $scope.hasGallery = ($scope.galleryCount > 0);
        });
    };

    // copy webcam (video) to canvas and make copy
    $scope.takePicture = function() {
        if (_video) {
            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas) return;    // need to create dynamic canvas then copy to
            // visible so I can use states to display image
            // rather than div hiding

            patCanvas.width = _video.width;
            patCanvas.height = _video.height;
            var ctxPat = patCanvas.getContext('2d');

            // manipulatable binary data
            var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
            ctxPat.putImageData(idata, 0, 0);

            // save pic
            $scope.newPic.pic = patCanvas.toDataURL('image/png');
            $scope.newPic.date = new Date();
            $scope.picReady = true;
        }
    };

    $scope.addToGallery = function() {
        var result = GalleryService.addPic($scope.newPic);
        if (result) {
            console.log("item added");
            $scope.hasGallery = true;
        } else {
            $scope.hasGallery = (GalleryService.galleryCount() > 0);
            console.log("additem failed");
        }
        $scope.newPic = {};
        $scope.picReady = false;
        $scope.galleryCount++;

    };
});