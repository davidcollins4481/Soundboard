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
                    templateUrl: '/js/app/views/soundboard.html',
                    controller: 'soundboardController'
                })
                .when('/upload-sound', {
                    templateUrl: '/js/app/views/uploader.html',
                    controller: 'soundboardUploader'
                })
                .when('/sound-detail/:name', {
                    templateUrl: '/js/app/views/soundDetail.html',
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
