angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
})

.controller('GalleryCtl', function($scope, $stateParams,$state,$ionicPopup,GalleryService) { // }, $stateParams) { //},localStorageService){
        $scope.gallery = [];
        // init controller by getting list of pics
        $scope.getPic = function() {
            console.log("Getting pic " + $stateParams.id);
            $scope.data.pic = GalleryService.getPic($stateParams.id);
            console.log("Found pic " + $scope.data.pic.name);
        };

        // init controller by getting list of pics
        $scope.getPics = function() {
            $scope.gallery = GalleryService.getPics();
        };

        $scope.deleteGallery = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Purge',
                template: 'Are you sure you want to delete entire gallery??'
            });
            confirmPopup.then(
                function (res) {
                    if (res) {
                        GalleryService.purgeGallery();
                        $state.go("tab.camera");
                    }
                })
        };

        $scope.cancelDeleteGallery = function() {
            $state.go("tab.gallery");
        }

        $scope.deletePic = function() {
            GalleryService.removePic($scope.data.pic);
            $scope.data.pics = GalleryService.getPics();
            $state.go('tab.gallery');
        };

        // init controller by getting a pic by $stateParams.id
        $scope.getPics();
})

.controller('GalleryPictureCtl', function($scope, $stateParams,$state, GalleryService) { // }, $stateParams) { //},localStorageService){
        $scope.galleryPicture = {};
        // init controller by getting list of pics
        $scope.getPic = function() {
            $scope.galleryPicture = GalleryService.getPic($stateParams.id);
        };

        $scope.removePic = function() {
            $scope.galleryPicture = GalleryService.removePic($stateParams.id);
            $state.go('tab.gallery');
        };


        function dataURItoBlob(dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for(var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
        }


        $scope.uploadBase64ImgToS3 = function(id, filename, callback){
            var xmlhttp = new XMLHttpRequest();
            var blobData = dataURItoBlob(base64Data);
            var contentType = false;
            if (filename.match(/.png/)) var contentType = 'image/png';
            if (filename.match(/.jpg/)) contentType = 'image/jpeg';
            if (!contentType){
                xStat.rec("content type not determined, use suffix .png or .jpg");
                return;
            }

            s3Man.getS3Policy(filename, function(s3Pkg){
                console.log("policy:", s3Pkg);
                var fd = new FormData();
                fd.append('key', s3Pkg.filename);
                fd.append('acl', 'public-read');
                fd.append('Content-Type', file.type);
                fd.append('AWSAccessKeyId', s3Pkg.awsKey);
                fd.append('policy',  s3Pkg.policy);
                fd.append('signature', s3Pkg.signature);
                fd.append("file", blobData);
                xmlhttp.open('POST', 'https://swoopuploadspublic.s3.amazonaws.com/', true);
                xmlhttp.send(fd);
            });
        }

/*
        $scope.uploadPic = function(id) {
            var Pic = GalleryService.getPic($stateParams.id);
//            Pic = Pic.replace(/^data:image\/(png|jpg);base64,/, "");


            var imgByte = Base64.decodeBase64(Pic);
            var bis = new ByteArrayInputStream(imgByte)

            val bucketName = "SOME_BUCKET"
            val AWS_ACCESS_KEY = "KEY"
            val AWS_SECRET_KEY = "SECRET"

            val yourAWSCredentials = new BasicAWSCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY)
            val amazonS3Client = new AmazonS3Client(yourAWSCredentials)
            val md = new ObjectMetadata

            amazonS3Client.putObject(bucketName, "fireside2.png", bis, md)
        }


            // Sending the image data to Server
            $.ajax({
                type: 'POST',
                url: 'Save_Picture.aspx/UploadPic',
                data: '{ "imageData" : "' + Pic + '" }',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (msg) {
                    alert("Done, Picture Uploaded.");
                }
            });




 $.post('/ajax/uploadthumbnail',
 {
 id : id,
 img : canvas.toDataURL("image/png")
 }, function(data) {
 console.log(data);
 });
 */





        // init controller by getting a pic by $stateParams.id
        $scope.getPic();
})

.controller('CameraCtl', function($scope, $stateParams, GalleryService) { // }, $stateParams) { //},localStorageService){
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
            $scope.galleryCount = GalleryService.picCount();
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
            $scope.newPic.id = -1;
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