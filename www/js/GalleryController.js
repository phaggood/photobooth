angular.module('starter.controllers', [])

.controller('GalleryCtl', function($scope, $stateParams,$state, GalleryService) { // }, $stateParams) { //},localStorageService){
        $scope.gallery = [];
        // init controller by getting list of pics
        $scope.getPic = function() {
            $scope.data.pic = GalleryService.getPic($stateParams.id);
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

        $scope.deletePic = function() {
            GalleryService.removePic($scope.data.pic);
            $scope.data.pics = GalleryService.getPics();
            $state.go('tab.gallery');
        };

        // init picture list
        $scope.getPics();
        alert("here");
});