var soundboardApp = angular.module('soundboardApp', ['ngRoute', 'soundboardControllers']);

soundboardApp
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: '/js/app/views/soundboard.html',
                    controller: 'SoundboardController'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }
    ]);
