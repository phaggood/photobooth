angular.module('starter.controllers', [])

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
        // init controller by getting a pic by $stateParams.id
        $scope.getPic();
});