var soundboardControllers = angular.module('soundboardControllers', []);

soundboardControllers.controller('SoundboardController',
    function($scope, $http, $routeParams) {
        $scope.audioRootDirectory = '/sounds/';
        $http.get('/getsounds')
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
            $http.post('/deletesound',
                    {filename: this.sound.name}
                )
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

soundboardControllers.controller('SoundboardUploader',
    function ($scope, $http, $routeParams) {
        $scope.uploading = [];

        $scope.$on('filesDragged', function (event, files) {

            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append('file', files[i]);
            }

            $http.post('/upload', data, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
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
