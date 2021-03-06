angular.module('starter.services', [])


    .factory("GalleryService", function (localStorageService) {

        var gallerySize = 0;

        var svc = {};

        svc.picCount = function () {
            var pics = localStorageService.get('pics');
            if (pics == null) {
                return 0;
            } else {
                return pics.length;
            }
        }

        // return all pictures from localstorage
        svc.getPics = function () {
            var pics = localStorageService.get('pics');
            if (pics != null) {
                gallerySize = pics.length;
            }
            return pics;
        };

        svc.galleryCount = function () {
            return gallerySize;
        };

        // insert new pic into storage
        svc.addPic = function (newPic) {
            var picsize = 0;
            var newArray = localStorageService.get('pics');
            var oldSize = 0;
            if (newArray == null) {
                newArray = [];
            } else {
                oldSize = newArray.length;
            }
            localStorageService.clearAll();
            newPic.uploaded = false;
            console.log("exporting pic on " + newPic.date)
            newArray.push(newPic);
            var result = localStorageService.add('pics', newArray);
            return (oldSize < newArray.length);
        };

        svc.removePic = function (picDate) {
            var originalSize = 0;
            var pics = localStorageService.get('pics');
            var newPics = [];
            for (var i = 1; i <= pics.length; i++) {
                if (pics[i].date !== picDate) {
                    newPics.push(pics[i]);
                }
            }
            localStorageService.clearAll();
            localStorageService.add("pics", newPics);
            console.log("list updated");
            return newPics.length < originalSize;
        };
        // return selected pic from storage
        svc.getPic = function (id) {
            var selectedPic = {}
            var pics = localStorageService.get("pics");
            if (pics != null)  {
                for(var i=0; i<pics.length; i++){
                    if (pics[i].date === id){
                        selectedPic = pics[i];
                    }
                }
            }
            return selectedPic;
        };

        svc.addComment = function (id, text) {
            var comments = localStorageService.get("comments");
            if (comments == null) comments = [];
            commentSet = comments[id];
            //commentSet.push(text)
            // localStorageService.put("commnets",commntSet)
            // console.log("Comments saved"
        };

        // empty storage
        svc.purgeGallery = function () {
            localStorageService.clearAll();
            gallerySize = 0;
            console.log("Gallery cleared");
        };

        return svc;

    })

