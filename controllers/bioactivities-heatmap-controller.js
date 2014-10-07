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
            var target_types_filter = bioactivities_heatmap_filter.target_types;
            var organisms_filter = bioactivities_heatmap_filter.organisms;
            
            var normalize_bioactivities = bioactivities_heatmap_filter.get_normalize_bioactivities();

            //Once again needed getters in lieu of variables
            var get_targets_filter = bioactivities_heatmap_filter.get_targets();
            var get_bioactivities_filter = bioactivities_heatmap_filter.get_bioactivities();
            var get_compounds_filter = bioactivities_heatmap_filter.get_compounds();
            
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
                        'bioactivities_filter': get_bioactivities_filter,
                        'targets_filter': get_targets_filter,
                        'compounds_filter': get_compounds_filter,
                        'target_types_filter': target_types_filter,
                        'organisms_filter': organisms_filter,
                        'normalize_bioactivities': normalize_bioactivities
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

