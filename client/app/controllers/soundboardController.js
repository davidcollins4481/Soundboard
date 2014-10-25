soundboardApp.controller('soundboardController', function ($scope, $http) {
    $scope.audioRootDirectory = '/sounds/';
    $http.get('/getsounds')
        .success(function(data) {
            $scope.sounds = data;
        });

    $scope.toggle = function(obj, $event) {
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

    $scope.delete = function() {
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
});
