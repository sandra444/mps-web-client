// Defines a new HTML directive <three-state-checkbox>
// Directive *MUST BE IN CAMEL CASE* for AngularJS to pick it up!
MPS.directive('threeStateCheckbox', function ($rootScope) {

    return {
        replace: true,
        restrict: 'E',
        scope: { checkboxes: '=' },

        // ng-model="master" is a virtual construct, i.e. it does not exist explicitly
        // within our HTML. It is created so that AngularJS can monitor changes to a
        // checkbox element created with this directive.
        template: '<input type="checkbox" ng-model="master" ng-change="master_change()">',
        controller: function ($scope, $element) {
            $scope.master_change = function () {
                if ($scope.master) {
                    angular.forEach($scope.checkboxes, function (checkbox, checkbox_index) {
                        checkbox.is_selected = true;
                    });
                } else {
                    angular.forEach($scope.checkboxes, function (checkbox, checkbox_index) {
                        checkbox.is_selected = false;
                    });
                }
                
                //console.log($scope);
                
                //Use the given ID to broadcast only when organism or target_type is clicked
                //Needs refactoring
                if ($scope.$id == '004' || $scope.$id == '005') {
                    $rootScope.$broadcast('heatmap_selection_update_all');
                }
                
            };
            $scope.$watch('checkboxes', function () {
                var all_are_set = true, all_are_clear = true;
                angular.forEach($scope.checkboxes, function (checkbox, checkbox_index) {
                    if (checkbox.is_selected) {
                        all_are_clear = false;
                    } else {
                        all_are_set = false;
                    }
                });
                if (all_are_set) {
                    $scope.master = true;
                    $element.prop('indeterminate', false);
                }
                else if (all_are_clear) {
                    $scope.master = false;
                    $element.prop('indeterminate', false);
                }
                else {
                    $scope.master = false;
                    $element.prop('indeterminate', true);
                }
            }, true);
        }
    };
});
