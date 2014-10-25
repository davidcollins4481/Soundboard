var soundboardApp = angular.module('soundboardApp', []);



soundboardApp.controller('soundboardUploader', function ($scope, $http) {
    $scope.uploading = [];

    $scope.$on('filesDragged', function (event, files) {

        var data = new FormData();
        for (var i = 0; i < files.length; i++) {
            data.append('file', files[i]);
        }

        $http.post('/upload', data, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data) {
            console.log('success');
            $scope.sounds = data;
        })
        .error(function() {
            console.log('fail');
        });

        $scope.$apply(function(){
            $scope.uploading = files;
        });
    });
});

soundboardApp.directive('dropTarget', function(){
    return {
        scope: true,
        link: function($scope, $element) {
            $element.bind('dragover', function(e) {
                console.log('drag');
                e.stopPropagation();
                e.preventDefault();

            });

            $element.bind('dragenter', function(e) {
                console.log('dragenter');
                e.stopPropagation();
                e.preventDefault();
                e.currentTarget.classList.add('active');
            });

            $element.bind('drop', function(e){
                e.stopPropagation();
                e.preventDefault();
                e.currentTarget.classList.remove('active');
                var files = e.dataTransfer.files;
                $scope.$emit('filesDragged', files);
                return false;
            });

            $element.bind('dragleave', function(e){
                console.log('dropping');
                e.stopPropagation();
                e.preventDefault();
                e.currentTarget.classList.remove('active');
            });
        }
    }
});
