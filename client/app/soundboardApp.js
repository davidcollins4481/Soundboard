var soundboardApp = angular.module('soundboardApp', [
    'ngRoute',
    'soundboardControllers',
    'soundboardDirectives'
    ]);

soundboardApp
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: '/js/app/views/soundboard.html',
                    controller: 'SoundboardController'
                })
                .when('/upload-sound', {
                    templateUrl: '/js/app/views/uploader.html',
                    controller: 'SoundboardUploader'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]);
