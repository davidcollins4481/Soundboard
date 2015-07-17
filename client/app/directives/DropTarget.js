var soundboardDirectives = angular.module('soundboard.directives', []);

soundboardDirectives.directive('dropTarget', function(){
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
                var files = e.originalEvent.dataTransfer.files;
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
