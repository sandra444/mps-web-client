MPS.controller(
    'bioactivities_heatmap_controller',
    [
        '$scope', '$http', 'bioactivities_heatmap_filter',
        function ($scope, $http, bioactivities_heatmap_filter) {
            'use strict';

            $scope.error_message_visible = false;
            var bioactivities_filter = bioactivities_heatmap_filter.bioactivities;
            var targets_filter = bioactivities_heatmap_filter.targets;
            var compounds_filter = bioactivities_heatmap_filter.compounds;

            /* destroy existing heatmap if it exists upon navigation */
            $scope.$on('$routeChangeSuccess', function() {
                $('svg').remove();
                window.spinner.spin(
                    document.getElementById("spinner")
                );
            });

            $http(
                {
                    url: '/bioactivities/gen_heatmap/',
                    method: 'POST',
                    data: {
                        'bioactivities_filter': bioactivities_filter,
                        'targets_filter': targets_filter,
                        'compounds_filter': compounds_filter
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }
            ).success(
                function (data) {
                    window.spinner.stop();
                    if (data["data_csv"] != undefined) {
                        $scope.heatmap_data_csv = data["data_csv"];
                        window.d3_heatmap_render($scope.heatmap_data_csv);

                    } else {
                        $scope.error_message_visible = true;
                        window.spinner.stop();
                    }
                }
            ).error(
                function () {
                    window.spinner.stop();
                    $scope.error_message_visible = true;
                }
            );

        }
    ]
);

