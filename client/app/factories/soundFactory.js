var soundFactory =  angular.module('soundboard.factories', [])
.factory('soundsFactory', function($http) {
    var factory = {};
    factory.getAll = function() {
        return $http.get('/getAll');
    }

    factory.get = function(name) {
        return $http.get('get', {
            params: {
                name: name
            }
        });
    }

    factory.delete = function(filename) {
        return $http.post('/delete', {
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
