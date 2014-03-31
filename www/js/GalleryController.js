angular.module('starter.controllers', [])

.controller('GalleryCtl', function($scope, $stateParams,$state, GalleryService) { // }, $stateParams) { //},localStorageService){
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
            GalleryService.purgeGallery();
            $state.go("tab.camera");
        };

        $scope.cancelDeleteGallery = function() {
            $state.go("tab.gallery");
        };

        $scope.deletePic = function() {
            GalleryService.removePic($scope.data.pic);
            $scope.data.pics = GalleryService.getPics();
            $state.go('tab.gallery');
        };

        // init picture list
        $scope.getPics();
});