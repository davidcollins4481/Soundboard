var soundboardControllers = angular.module('soundboard.controllers', ['soundboard.factories']);

soundboardControllers.controller('soundboardController',
    function($scope, $http, $routeParams, soundsFactory) {
        $scope.audioRootDirectory = '/sounds/';

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

soundboardControllers.controller('soundboardDetail',
    function ($scope, $http, $routeParams, soundsFactory) {
        soundsFactory.get($routeParams.name)
            .success(function(data) {
                $scope.sound = data;
            })
            .error(function() {
                console.log('fail');
            });

        $scope.update = function() {
            //console.log($scope.sound);
            soundsFactory.save($scope.sound);
        }
    }
);
