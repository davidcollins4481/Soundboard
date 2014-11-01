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


            var updateAnalyzers = function(time) {
                var analyserContext = null;
                // update analyzers
                if (!analyserContext) {
                    var canvas = document.getElementById("analyser");
                    canvasWidth = canvas.width;
                    canvasHeight = canvas.height;
                    analyserContext = canvas.getContext('2d');
                }

                // analyzer draw code here
                {
                    var SPACING = 3;
                    var BAR_WIDTH = 1;
                    var numBars = Math.round(canvasWidth / SPACING);
                    var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

                    analyserNode.getByteFrequencyData(freqByteData);

                    analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
                    analyserContext.fillStyle = '#F6D565';
                    analyserContext.lineCap = 'round';
                    var multiplier = analyserNode.frequencyBinCount / numBars;

                    // Draw rectangle for each frequency bin.
                    for (var i = 0; i < numBars; ++i) {
                        var magnitude = 0;
                        var offset = Math.floor( i * multiplier );
                        // gotta sum/average the block, or we miss narrow-bandwidth spikes
                        for (var j = 0; j< multiplier; j++)
                            magnitude += freqByteData[offset + j];
                        magnitude = magnitude / multiplier;
                        var magnitude2 = freqByteData[i * multiplier];
                        analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
                        analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
                    }
                }

                rafID = window.requestAnimationFrame( updateAnalysers );
            }

            var initStream = function(stream) {
                var audioContext = new AudioContext();
                inputPoint = audioContext.createGain();

                // Create an AudioNode from the stream.
                realAudioInput = audioContext.createMediaStreamSource(stream);
                audioInput = realAudioInput;
                audioInput.connect(inputPoint);

                analyserNode = audioContext.createAnalyser();
                analyserNode.fftSize = 2048;
                inputPoint.connect( analyserNode );

                audioRecorder = new Recorder(inputPoint, {
                    workerPath: '/bower/Recorderjs/recorderWorker.js'
                });

                zeroGain = audioContext.createGain();
                zeroGain.gain.value = 0.0;
                inputPoint.connect( zeroGain );
                zeroGain.connect( audioContext.destination );

                updateAnalyzers();
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
