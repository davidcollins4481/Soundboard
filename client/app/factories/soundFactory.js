var soundFactory =  angular.module('soundboard.factories', [])
.factory('soundsFactory', function($http) {
    var factory = {};
    factory.getAll = function() {
        return $http.get('/getsounds');
    }

    factory.get = function(name) {
        return $http.get('getsound', {
            params: {
                name: name
            }
        });
    }

    factory.delete = function(filename) {
        return $http.post('/deletesound', {
            filename: filename
        });
    }

    factory.add = function(data) {
        return $http.post('/upload', data, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
    }

    factory.save = function(sound) {
        return $http.post('/save', {
            sound: sound
        });
    }

    return factory;
});
