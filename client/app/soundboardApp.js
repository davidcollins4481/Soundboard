var soundboardApp = angular.module('soundboardApp', [
    'ngRoute',
    'soundboard.controllers',
    'soundboard.directives'
    ]);

soundboardApp
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: '/js/app/views/board.html',
                    controller: 'soundboardController'
                })
                .when('/upload', {
                    templateUrl: '/js/app/views/uploader.html',
                    controller: 'soundboardUploader'
                })
                .when('/detail/:name', {
                    templateUrl: '/js/app/views/detail.html',
                    controller: 'soundDetail'
                })
                .when('/record', {
                    templateUrl: '/js/app/views/record.html',
                    controller: 'soundRecorder'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]);
