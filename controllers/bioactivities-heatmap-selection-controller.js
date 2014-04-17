MPS.controller(
    'bioactivities_heatmap_selection_controller',
    [
        '$scope', '$location', 'bioactivities_heatmap_filter',
        function ($scope, $location, bioactivities_heatmap_filter) {
            'use strict';

            // Give control of the factory to the local $scope:
            // This is especially important when we are manipulating
            // data within the factory itself
            $scope.bioactivities_heatmap_filter = bioactivities_heatmap_filter;

            $scope.submit = function () {
                $location.path('/bioactivities/heatmap');
            };
        }
    ]
);
