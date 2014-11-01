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
        $scope.uploaded  = [];

        $scope.$on('filesDragged', function (event, files) {

            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append('file', files[i]);
            }

            soundsFactory.add(data)
                .success(function(data) {
                    console.log('success');
                    data.forEach(function(d) {
                        d.savedStatus = 'unsaved';
                    });

                    $scope.uploaded = data;
                })
                .error(function() {
                    console.log('fail');
                });


            $scope.update = function(sound) {
                soundsFactory.save(sound)
                    .success(function() {
                        sound.savedStatus = 'saved';
                    })
                    .error(function() {
                        console.log('fail');
                    })
            };
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

soundboardControllers.controller('soundRecorder',
    function ($scope, $http, $routeParams, $location, soundsFactory) {

        $scope.init = function() {
            console.log('init');
            navigator.getUserMedia  = navigator.getUserMedia ||
                      navigator.webkitGetUserMedia ||
                      navigator.mozGetUserMedia ||
                      navigator.msGetUserMedia;

            var canvas = document.querySelector('#analyser');
            canvasCtx = canvas.getContext('2d');

            var initStream = function(stream) {
                var audioContext = new AudioContext();
                var analyser = audioContext.createAnalyser();

                analyser.getByteTimeDomainData(dataArray);

                var micInput = audioContext.createMediaStreamSource(stream);
                var gainNode = audioContext.createGain();

                micInput.connect(analyser);
                analyser.connect(gainNode);
                gainNode.connect(audioContext.destination);

                //dimensions of canvas
                HEIGHT = canvas.height;
                WIDTH = canvas.width;

                analyser.fftSize = 256;
                var bufferLength = analyser.frequencyBinCount;
                var dataArray = new Uint8Array(bufferLength);

                canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

                function draw() {

                    drawVisual = requestAnimationFrame(draw);

                    analyser.getByteFrequencyData(dataArray);

                    canvasCtx.fillStyle = 'rgb(255, 255, 255)';
                    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

                    var barWidth = (WIDTH / bufferLength) * 2.5;
                    var barHeight;
                    var x = 0;

                    for (var i = 0; i < bufferLength; i++) {
                        barHeight = dataArray[i];

                        canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',155,255)';
                        canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

                        x += barWidth + 1;
                    }
                };

                draw();
            };

            navigator.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },
            }, initStream, function(e) {
                alert('Error getting audio');
                console.log(e);
            });
        };
    }
);
