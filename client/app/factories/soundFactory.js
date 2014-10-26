var soundFactory =  angular.module('soundboard.factories', [])
.factory('soundsFactory', function($http) {
    var factory = {};
    factory.getAllSounds = function() {
        return $http.get('/getsounds');
    }

    factory.getSound = function(name) {
        return $http.get('getsound', {
            params: {
                name: name
            }
        });
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

    factory.save = function(sound) {
        
    }

    return factory;
});
