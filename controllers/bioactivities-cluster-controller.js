MPS.controller(
    'bioactivities_cluster_controller',
    [
        '$scope', '$http', 'bioactivities_heatmap_filter',
        function ($scope, $http, bioactivities_heatmap_filter) {
            'use strict';

            $scope.error_message_visible = false;
            var target_types_filter = bioactivities_heatmap_filter.target_types;
            var organisms_filter = bioactivities_heatmap_filter.organisms;
            
            var normalize_bioactivities = bioactivities_heatmap_filter.get_normalize_bioactivities();

            //Once again needed getters in lieu of variables
            var get_targets_filter = bioactivities_heatmap_filter.get_targets();
            var get_bioactivities_filter = bioactivities_heatmap_filter.get_bioactivities();
            var get_compounds_filter = bioactivities_heatmap_filter.get_compounds();
            
            // Cluster specific
            var get_method = bioactivities_heatmap_filter.get_method();
            var get_metric = bioactivities_heatmap_filter.get_metric();
            var get_chemical_properties = bioactivities_heatmap_filter.get_chemical_properties();
            
            /* destroy existing cluster if it exists upon navigation */
            $scope.$on('$routeChangeSuccess', function() {
                $('svg').remove();
                window.spinner.spin(
                    document.getElementById("spinner")
                );
            });

            $http(
                {
                    url: '/bioactivities/gen_cluster/',
                    method: 'POST',
                    data: {
                        'bioactivities_filter': get_bioactivities_filter,
                        'targets_filter': get_targets_filter,
                        'compounds_filter': get_compounds_filter,
                        'target_types_filter': target_types_filter,
                        'organisms_filter': organisms_filter,
                        'normalize_bioactivities': normalize_bioactivities,
                        'metric': get_metric,
                        'method': get_method,
                        'chemical_properties': get_chemical_properties
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }
            ).success(
                function (data) {
                    window.spinner.stop();
                    if (data["data_json"] != undefined) {
                        $scope.cluster_data_json = data["data_json"];
                        $scope.bioactivities = data["bioactivities"];
                        $scope.compounds = data["compounds"];
                        window.d3_cluster_render($scope.cluster_data_json,$scope.bioactivities,$scope.compounds);

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

