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
                    controller: 'soundboardController'
                })
                .when('/upload-sound', {
                    templateUrl: '/js/app/views/uploader.html',
                    controller: 'soundboardUploader'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]);
