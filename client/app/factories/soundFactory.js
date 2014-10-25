var soundFactory =  angular.module('soundboardFactories', [])
.factory('soundsFactory', function($http) {
    var factory = {};
    factory.getSounds = function() {
        return $http.get('/getsounds');
    }

    factory.deleteSound = function(filename) {
        return $http.post('/deletesound', {
            filename: filename
        });
    }

    factory.addSounds = function(data) {
        return $http.post('/upload', data, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    }

    return factory;
});
