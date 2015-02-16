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

            audio.removeEventListener('ended');
            var resetState = function() {
                this.className = 'play';
            }.bind(button);

            audio.addEventListener("ended", resetState);

            if (button.className === "play") {
                audio.play();
                button.className = "stop";
            } else {
                audio.pause();
                button.className = "play";
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
                $scope.gain = 1;
                var context = new AudioContext();
                var audioSrc = $scope.audioRootDirectory + data.name + '.' + data._extension;

                var getBuffer = undefined;

                var drawAudioGraph = function() {
                    var buffer = getBuffer();
                    console.log('processing...');
                    // each buffer is of equal length
                    var isMono = buffer.numberOfChannels == 1;
                    var drawChannel = function(context, currentChannel, color) {
                        context.beginPath();
                        context.strokeStyle = color;
                        context.lineWidth = 1;
                        context.moveTo(0, cH/2);
                        var gap = cW / currentChannel.length;

                        var currentX = 0;
                        for (var i = 0; i < currentChannel.length; i++) {
                            currentX = currentX + gap;
                            var y = (cH/2) + ((currentChannel[i] *-1) * lineMultiplier);
                            context.lineTo(currentX, y);
                        }

                        context.stroke();
                    };

                    var canvas = document.querySelector('.signal-container canvas');
                    var context = canvas.getContext('2d');

                    var lineMultiplier = 100;

                    var cH = canvas.height = 250;
                    var cW = canvas.width = window.innerWidth - (window.innerWidth / 8);

                    context.fillStyle = '#ffffff';
                    context.fillRect(0, 0, cW, cH);

                    context.strokeStyle = '#000000';
                    context.beginPath();
                    context.moveTo(0, cH/2);
                    context.lineTo(cW, cH/2);
                    context.lineWidth = 1;
                    context.stroke();

                    // draw clip lines
                    context.beginPath();
                    //context.setLineDash([4]);
                    context.strokeStyle = 'red';
                    context.moveTo(0, cH/2  - lineMultiplier);
                    context.lineTo(cW, cH/2 - lineMultiplier);
                    context.lineWidth = 1;
                    context.closePath();
                    context.stroke();

                    context.beginPath();
                    context.strokeStyle = 'red';
                    context.moveTo(0, cH/2  + lineMultiplier);
                    context.lineTo(cW, cH/2 + lineMultiplier);
                    context.lineWidth = 1;
                    context.closePath();
                    context.stroke();

                    var leftChannel = buffer.getChannelData(0);
                    drawChannel(context, leftChannel, "green");

                    console.log('Mono? ' + isMono);
                    if (!isMono) {
                        var rightChannel = buffer.getChannelData(1);
                        drawChannel(context, rightChannel, "blue");
                    }
                }

                var onComplete = function(buffers) {
                    var buffer = buffers[0];

                    // fill out a couple more vars
                    $scope.duration = buffer.duration.toPrecision(2) + ' seconds';
                    $scope.channels = buffer.numberOfChannels;
                    $scope.$apply();

                    getBuffer = function() {
                        return buffer;
                    };

                    drawAudioGraph();
                };

                var getCurrentPlaying = undefined;

                $scope.play = function(e) {
                    var button = e.currentTarget;
                    button.disabled = true;

                    var source = context.createBufferSource();
                    source.buffer = getBuffer();
                    var gainNode = context.createGain();

                    gainNode.gain.value = $scope.gain;

                    source.connect(gainNode);
                    gainNode.connect(context.destination);

                    // to loop source.loop = true;
                    source.loop = !!$scope.loop;
                    source.start()

                    source.onended = function() {
                        button.disabled = false;
                    }

                    getCurrentPlaying = function() {
                        return source;
                    }
                };

                $scope.stop = function(e) {
                    var current = getCurrentPlaying();
                    current.stop();
                };

                $scope.save = function(e) {
                    console.log('saving');
                    var type = $scope.sound.mimeType;
                    var channel = getBuffer().getChannelData(1);
                    var blob = new Blob([channel], {type: type});
                    var url =  URL.createObjectURL(blob);
                };

                var bufferLoader = new BufferLoader(context, [audioSrc], onComplete);

                bufferLoader.load();
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
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                var audioContext = new AudioContext();
                var inputPoint = audioContext.createGain();
                var micInput = audioContext.createMediaStreamSource(stream);
                micInput.connect(inputPoint);

                var analyser = audioContext.createAnalyser();
                //analyser.fftSize = 256; // thickness of bars - default is 2048

                inputPoint.connect(analyser);

                var zeroGain = audioContext.createGain();
                zeroGain.gain.value = 0.0;
                inputPoint.connect( zeroGain );
                zeroGain.connect( audioContext.destination );

                var recorder = new Recorder(micInput, {
                    workerPath: '/bower/Recorderjs/recorderWorker.js'
                });

                $scope.stopRecording = function(e) {
                    e.preventDefault();
                    console.log('stopping');
                    recorder && recorder.stop();
                    var createDownloadLink = function() {
                        recorder && recorder.exportWAV(function(blob) {
                            var url = URL.createObjectURL(blob);
                            var li = document.createElement('li');
                            var au = document.createElement('audio');
                            var hf = document.createElement('a');

                            au.controls = true;
                            au.src = url;
                            hf.href = url;
                            hf.download = new Date().toISOString() + '.wav';
                            hf.innerHTML = hf.download;
                            li.appendChild(au);
                            li.appendChild(hf);
                            document.querySelector('#recordingslist').appendChild(li);
                        });
                    };

                    createDownloadLink();
                    recorder.clear();
                };

                $scope.startRecording = function(e) {
                    e.preventDefault();
                    console.log('starting');
                    recorder && recorder.record();
                };

                //dimensions of canvas
                HEIGHT = canvas.height;
                WIDTH = canvas.width;

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
