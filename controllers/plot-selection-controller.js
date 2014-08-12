MPS.controller(
    'plot_selection_controller',
    [
        '$scope', '$location', 'bioactivities_plot_filter',
        function ($scope, $location, bioactivities_plot_filter) {
            'use strict';

            // Give control of the factory to the local $scope:
            // This is especially important when we are manipulating
            // data within the factory itself
            $scope.bioactivities_plot_filter = bioactivities_plot_filter;

            $scope.submit = function () {
                $location.path('/bioactivities/plot');
            };
        }
    ]
);
