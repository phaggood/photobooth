angular.module('starter.controllers', [])

    .controller('GalleryPictureCtl', function ($scope, $stateParams, $state, GalleryService) { // }, $stateParams) { //},localStorageService){
        $scope.galleryPicture = {};
        // init controller by getting list of pics
        $scope.getPic = function () {
            $scope.galleryPicture = GalleryService.getPic($stateParams.id);
        };

        $scope.removePic = function () {
            if (confirm('Are you sure you want to delete this?')) {
                var result = GalleryService.removePic($stateParams.id);
                if (result === true) {
                    $state.go('tab.gallery');
                } else {
                    alert("Image not deleted");
                }
            }
        };
        // init controller by getting a pic by $stateParams.id
        $scope.getPic();
    });