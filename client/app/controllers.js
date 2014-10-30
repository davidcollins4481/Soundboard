var soundboardControllers = angular.module('soundboard.controllers', ['soundboard.factories']);

soundboardControllers.controller('soundboardController',
    function($scope, $http, $routeParams, soundsFactory) {
        $scope.audioRootDirectory = '/sounds/';
        $scope.extendedState = 'closed';

        soundsFactory.getAll()
            .success(function(data) {
                $scope.sounds = data;
            });

        $scope.toggle = function($event, $obj) {
            console.log($event);
            var button = $event.currentTarget;
            var audio = button.nextElementSibling;

            if (audio.className == "stopped") {
                audio.play();
                audio.className = "";
                button.src = "/img/stop.png";
            } else {
                audio.pause();
                audio.className = "stopped";
                button.src = "/img/play.png";
            }
        }

        $scope.delete = function($event, $obj) {
            $event.preventDefault();
            console.log('deleting ' + this.sound.name);
            soundsFactory.delete(this.sound.name)
                .success(function(data) {
                    $scope.sounds = data;
                    console.log('deleted');
                })
                .error(function() {
                    console.log('error');
                });
        }

        $scope.openExtendedInfo = function(e) {
            e.preventDefault();
            $scope.extendedState = 'open';
        }

        $scope.closeExtendedInfo = function(e) {
            e.preventDefault();
            $scope.extendedState = 'closed';
        }
    }
);

soundboardControllers.controller('soundboardUploader',
    function ($scope, $http, $routeParams, soundsFactory) {
        $scope.uploading = [];

        $scope.$on('filesDragged', function (event, files) {

            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append('file', files[i]);
            }

            soundsFactory.add(data)
                .success(function(data) {
                    console.log('success');
                    $scope.sounds = data;
                })
                .error(function() {
                    console.log('fail');
                });

            $scope.$apply(function(){
                $scope.uploading = files;
            });
        });
    }
);

soundboardControllers.controller('soundDetail',
    function ($scope, $http, $routeParams, $location, soundsFactory) {
        $scope.savedStatus = 'saved';
        $scope.audioRootDirectory = '/sounds/';

        soundsFactory.get($routeParams.name)
            .success(function(data) {
                $scope.sound = data;
            })
            .error(function() {
                console.log('fail');
            });

        $scope.update = function() {
            soundsFactory.save($scope.sound)
                .success(function() {
                    $scope.savedStatus = 'saved';
                    $location.path("/");
                })
                .error(function() {
                    console.log('fail');
                })
        };

        $scope.changed = function() {
            console.log('changed');
            $scope.savedStatus = 'unsaved';
        };
    }
);
