app.directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.myForm.password.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
});
app.directive('uniqueEmail', function($http) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind('blur', function (e) {
                ngModel.$setValidity('unique', true);
                $http.get("/demo_angular/services/checkUnique?email=" + element.val()).success(function(data) {
                    if (data) {
                        ngModel.$setValidity('unique', false);
                    }
                });
            });
        }
    };
});